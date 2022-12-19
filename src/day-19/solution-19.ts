import {enumKeys} from "../utils/enumKeys";
const clone = require('lodash/cloneDeep.js');

enum Resource {
  ORE,
  CLAY,
  OBSIDIAN,
  GEODE
}

type Robot = {
  type: Resource,
  cost: {
    ore: Resource,
    count: number,
  }[]
}

type Inventory = {
  robots: Record<Resource, number>,
  ores: Record<Resource, number>,
}

type Blueprint = {
  id: number,
  geodes: number,
  robot: Record<Resource, Robot>,
}

type RobotRound = {
  minute: number,
  maxGeodeCount: number,
  inventory: Inventory,
}

type ResourceCount = Record<Resource, number>;
type BuildQueue = ResourceCount;

let b: Blueprint[] = [];
let roundCountTotal = 0;
let maxMinuteCount = 10;
let roundCache: Record<string, boolean> = {};


const initInventory = () => ({
  robots: {
    [Resource.ORE]: 1,
    [Resource.CLAY]: 0,
    [Resource.OBSIDIAN]: 0,
    [Resource.GEODE]: 0,
  },
  ores: {
    [Resource.ORE]: 0,
    [Resource.CLAY]: 0,
    [Resource.OBSIDIAN]: 0,
    [Resource.GEODE]: 0,
  },
});

const initOreCountObject = (initValue: number = 0): BuildQueue => ({
  [Resource.ORE]: initValue,
  [Resource.CLAY]: initValue,
  [Resource.OBSIDIAN]: initValue,
  [Resource.GEODE]: initValue,
})

const parseBlueprints = (input: string[]) => {
  input.forEach(i => {
    const [bId, oreRobotOreCost, clayRobotOreCost, obsidianRobotOreCost, obsidianRobotClayCost, geodeRobotOreCost, geodeRobotObsidianCost] =
      i.replace('Blueprint ', '') //blueprint id
        .replace(': Each ore robot costs ', ';') //ore cost of ore robot
        .replace(' ore. Each clay robot costs ', ';') //ore cost of clay robot
        .replace(' ore. Each obsidian robot costs ', ';') //ore cost of obsidian robot
        .replace(' ore and ', ';') //clay cost of obsidian robot
        .replace(' clay. Each geode robot costs ', ';') //ore cost of geode robot
        .replace(' ore and ', ';') //obsidian cost of geode robot
        .replace(' obsidian.', '')
        .split(';').map(Number);

    b.push({
      id: bId,
      geodes: 0,
      robot: {
        [Resource.ORE]: {
          type: Resource.ORE,
          cost: [
            {ore: Resource.ORE, count: oreRobotOreCost}
          ]
        },
        [Resource.CLAY]: {
          type: Resource.CLAY,
          cost: [
            {ore: Resource.ORE, count: clayRobotOreCost}
          ]
        },
        [Resource.OBSIDIAN]: {
          type: Resource.OBSIDIAN,
          cost: [
            {ore: Resource.ORE, count: obsidianRobotOreCost},
            {ore: Resource.CLAY, count: obsidianRobotClayCost},
          ]
        },
        [Resource.GEODE]: {
          type: Resource.GEODE,
          cost: [
            {ore: Resource.ORE, count: geodeRobotOreCost},
            {ore: Resource.OBSIDIAN, count: geodeRobotObsidianCost}
          ]
        }
      }
    })
  });
}


const logNiceOres = (ores: ResourceCount) => `Ore: ${ores[Resource.ORE]} | Clay: ${ores[Resource.CLAY]} | Obsidian: ${ores[Resource.OBSIDIAN]} | GEODE: ${ores[Resource.GEODE]} `

const cacheKeyPartFromOreCount = (r: ResourceCount) => `${r[Resource.ORE]}x${r[Resource.CLAY]}x${r[Resource.OBSIDIAN]}x${r[Resource.GEODE]}`;

const cacheRobotRoundKey = (r: RobotRound) => `${r.minute}x${r.maxGeodeCount}x${r.inventory.robots[Resource.ORE]}x${r.inventory.robots[Resource.CLAY]}x${r.inventory.robots[Resource.OBSIDIAN]}x${r.inventory.robots[Resource.GEODE]}x${r.inventory.ores[Resource.ORE]}x${r.inventory.ores[Resource.CLAY]}x${r.inventory.ores[Resource.OBSIDIAN]}x${r.inventory.ores[Resource.GEODE]}`;

const minutesToBuildQueue = (b: Blueprint, robotType: Resource, i: Inventory): number => {
  const totalCost = initOreCountObject();
  let maxMinutes = 0;

  b.robot[robotType].cost.forEach(oc => {
    totalCost[oc.ore] += oc.count;
    const minutes = Math.ceil((totalCost[oc.ore] - i.ores[oc.ore]) / i.robots[oc.ore] );
    if (minutes > maxMinutes) maxMinutes = minutes;
  })

  return maxMinutes + 1;
}

const runMinutesAndBuild = (b: Blueprint, m: number, robotType: Resource, i: Inventory): Inventory => {
  const newI = clone(i);

  //increase resources by "m" minutes
  enumKeys(Resource).forEach(o => {
    newI.ores[Resource[o]] += (m * newI.robots[Resource[o]]);
  });

  b.robot[robotType].cost.forEach(oc => {
    newI.ores[oc.ore] -= oc.count ; //decrease resources for robot
  });
  newI.robots[robotType]++; //increase robot count

  return newI;
}

let maximumResourcesNeeded: ResourceCount = initOreCountObject();
let shouldQueueRobotCache: Record<string, ResourceCount> = {};

const computeMaximumResourcesNeededFromBlueprint = (b: Blueprint) => {
  const max = initOreCountObject();
  enumKeys(Resource).forEach(o => b.robot[Resource[o]].cost.forEach(oc => {if (max[oc.ore] < oc.count) max[oc.ore] = oc.count}));
  maximumResourcesNeeded = max;
}



const shouldQueueRobot = (inventory: Inventory): ResourceCount => {
  const cacheKey = cacheKeyPartFromOreCount(inventory.ores);

  let result = shouldQueueRobotCache[cacheKey];

  if (result === undefined) {
    result = initOreCountObject(1);

    //in case we have already enough of robots to make everything, we don't need to build it (except GEODE, of course)
    enumKeys(Resource).forEach(o => { if (inventory.robots[Resource[o]] >= maximumResourcesNeeded[Resource[o]] && Resource[o] !== Resource.GEODE) result[Resource[o]] = 0;});

    //in case we dont have CLAY robot, we can't build OBSIDIAN robot
    if (inventory.robots[Resource.CLAY] === 0) result[Resource.OBSIDIAN] = 0;

    //in case we dont have OBSIDIAN robot, we can't build GEODE robot
    if (inventory.robots[Resource.OBSIDIAN] === 0) result[Resource.GEODE] = 0;

    //my very rude assumption, that we don't need ORE and CLAY robots when we already have 2 obsidian robots
    if (inventory.robots[Resource.OBSIDIAN] > 2) {
      result[Resource.ORE] = 0;
      result[Resource.CLAY] = 0;
    }
  }

  return result;
}

const runRound = ({minute, maxGeodeCount, inventory}: RobotRound, b: Blueprint): RobotRound[] => {
  roundCountTotal++;
  let newMin = minute + 1;

  if (newMin > maxMinuteCount) return [];

  const baseRobotQueue: Resource[] = [];

  const robotsToQueue = shouldQueueRobot(inventory);
  enumKeys(Resource).forEach(o => {if (robotsToQueue[Resource[o]] === 1) baseRobotQueue.push(Resource[o]); });

  const resultRobotRounds: RobotRound[] = [];

  baseRobotQueue.forEach(rq => {
    let minutesToBuild = minutesToBuildQueue(b, rq, inventory);
    if (minutesToBuild + minute < maxMinuteCount) {
      const newInventory = runMinutesAndBuild(b, minutesToBuild, rq, inventory);
      const robotRound: RobotRound = {
        minute: minute + minutesToBuild,
        maxGeodeCount: newInventory.ores[Resource.GEODE],
        inventory: newInventory,
      };
      const cacheKey = cacheRobotRoundKey(robotRound);
      if (roundCache[cacheKey] === undefined) {
        roundCache[cacheKey] = true;
        resultRobotRounds.push(robotRound);
      }
    }
  });

  return resultRobotRounds;
}

type RobotRoundList = {
  head?: RobotRoundListNode,
  tail?: RobotRoundListNode,
}

type RobotRoundListNode = {
  round: RobotRound,
  next?: RobotRoundListNode,
}

const runBlueprint = (b: Blueprint, minutes: number) => {
  console.log("==== BLUEPRINT STARTED ==== ", b.id);
  const start = Date.now();

  computeMaximumResourcesNeededFromBlueprint(b);
  const baseRoundNode: RobotRoundListNode = {
    next: undefined,
    round: {
      minute: 0,
      maxGeodeCount: 0,
      inventory: clone(initInventory()),
    }
  };

  const roundLinkedList: RobotRoundList = {
    head: baseRoundNode,
    tail: baseRoundNode,
  };

  let maxGeodeCount = 0;
  roundCountTotal = 0;
  roundCache = {};
  shouldQueueRobotCache = {};
  maxMinuteCount = minutes;

  while (roundLinkedList.head) {
    const round = roundLinkedList.head.round;

    if (round.inventory.robots[Resource.GEODE] > 0) {
      const minDiff = maxMinuteCount - round.minute;
      const geodesInTheEnd = round.maxGeodeCount + minDiff * round.inventory.robots[Resource.GEODE];
      if (geodesInTheEnd > maxGeodeCount) {
        maxGeodeCount = geodesInTheEnd;
      }
    }

    runRound(round, b).forEach(x => {
      if (roundLinkedList.tail) {
        roundLinkedList.tail.next = {
          round: x,
          next: undefined
        };
        roundLinkedList.tail = roundLinkedList.tail.next;
      }
    });
    roundLinkedList.head = roundLinkedList.head.next;
  }
  const end = Date.now();
  console.log("Duration: ", (end - start) / 1000 , " seconds")

  console.log("Total rounds: ", roundCountTotal, "; Max geode count in the end: ", maxGeodeCount);
  b.geodes = maxGeodeCount;
  console.log("==== BLUEPRINT ENDED   ==== ")
}

exports.solution = (input: string[]) => {
  parseBlueprints(input);

  let qualityLevel = 0;

  // PART ONE:
  b.forEach(blueprint => {
    runBlueprint(blueprint, 24);
    qualityLevel += (blueprint.id * blueprint.geodes);
  });
  console.log("========= RESULT PART ONE: ", qualityLevel);

  // PART TWO:
  qualityLevel = 1;
  b.filter((b, i) => i <= 2).forEach(blueprint => {
    runBlueprint(blueprint, 32);
    qualityLevel *= blueprint.geodes;
  });
  console.log("========= RESULT PART TWO: ", qualityLevel);
}
