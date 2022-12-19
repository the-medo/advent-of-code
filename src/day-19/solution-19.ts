import {enumKeys} from "../utils/enumKeys";

enum Ore {
  ORE,
  CLAY,
  OBSIDIAN,
  GEODE
}

type Robot = {
  type: Ore,
  cost: {
    ore: Ore,
    count: number,
  }[]
}

type Inventory = {
  robots: Record<Ore, number>,
  ores: Record<Ore, number>,
}

type Blueprint = {
  id: number,
  geodes: number,
  robot: Record<Ore, Robot>,
}

type RobotRound = {
  minute: number,
  maxGeodeCount: number,
  inventory: Inventory,
}

type OreCount = Record<Ore, number>;
type BuildQueue = OreCount;

let b: Blueprint[] = [];
let roundCountTotal = 0;
let maxMinuteCount = 10;
let roundCache: Record<string, boolean> = {};


const initInventory = () => ({
  robots: {
    [Ore.ORE]: 1,
    [Ore.CLAY]: 0,
    [Ore.OBSIDIAN]: 0,
    [Ore.GEODE]: 0,
  },
  ores: {
    [Ore.ORE]: 0,
    [Ore.CLAY]: 0,
    [Ore.OBSIDIAN]: 0,
    [Ore.GEODE]: 0,
  },
});

const initOreCountObject = (): BuildQueue => ({
  [Ore.ORE]: 0,
  [Ore.CLAY]: 0,
  [Ore.OBSIDIAN]: 0,
  [Ore.GEODE]: 0,
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
        [Ore.ORE]: {
          type: Ore.ORE,
          cost: [
            {ore: Ore.ORE, count: oreRobotOreCost}
          ]
        },
        [Ore.CLAY]: {
          type: Ore.CLAY,
          cost: [
            {ore: Ore.ORE, count: clayRobotOreCost}
          ]
        },
        [Ore.OBSIDIAN]: {
          type: Ore.OBSIDIAN,
          cost: [
            {ore: Ore.ORE, count: obsidianRobotOreCost},
            {ore: Ore.CLAY, count: obsidianRobotClayCost},
          ]
        },
        [Ore.GEODE]: {
          type: Ore.GEODE,
          cost: [
            {ore: Ore.ORE, count: geodeRobotOreCost},
            {ore: Ore.OBSIDIAN, count: geodeRobotObsidianCost}
          ]
        }
      }
    })
  });
}

const clone = require('lodash/cloneDeep.js');

const logNiceOres = (ores: OreCount) => `Ore: ${ores[Ore.ORE]} | Clay: ${ores[Ore.CLAY]} | Obsidian: ${ores[Ore.OBSIDIAN]} | GEODE: ${ores[Ore.GEODE]} `

const cacheRobotRoundKey = (r: RobotRound) => `${r.minute}x${r.maxGeodeCount}x${r.inventory.robots[Ore.ORE]}x${r.inventory.robots[Ore.CLAY]}x${r.inventory.robots[Ore.OBSIDIAN]}x${r.inventory.robots[Ore.GEODE]}x${r.inventory.ores[Ore.ORE]}x${r.inventory.ores[Ore.CLAY]}x${r.inventory.ores[Ore.OBSIDIAN]}x${r.inventory.ores[Ore.GEODE]}`;

const minutesToBuildQueue = (b: Blueprint, q: BuildQueue, i: Inventory): number => {
  const totalCost = initOreCountObject();
  let maxMinutes = 0;

  enumKeys(Ore).forEach(o => {
    b.robot[Ore[o]].cost.forEach(oc => {
      totalCost[oc.ore] += (q[Ore[o]] * oc.count);
      const minutes = Math.ceil((totalCost[oc.ore] - i.ores[oc.ore]) / i.robots[oc.ore] );
      if (minutes > maxMinutes) maxMinutes = minutes;
    })
  });

  return maxMinutes + 1;
}

const runMinutesAndBuild = (b: Blueprint, m: number, q: BuildQueue, i: Inventory): Inventory => {
  const newI = clone(i);

  //increase resources by "m" minutes
  enumKeys(Ore).forEach(o => {
    newI.ores[Ore[o]] += (m * newI.robots[Ore[o]]);
  });

  enumKeys(Ore).forEach(o => {
    if (q[Ore[o]] > 0) {
      b.robot[Ore[o]].cost.forEach(oc => {
        newI.ores[oc.ore] -= (oc.count * q[Ore[o]]); //decrease resources for robots in queue
      });
      newI.robots[Ore[o]] +=  q[Ore[o]]; //increase robot count for robots in queue
    }
  });

  return newI;
}

const runRound = ({minute, maxGeodeCount, inventory}: RobotRound, b: Blueprint): RobotRound[] => {
  roundCountTotal++;
  let newMin = minute + 1;

  if (newMin > maxMinuteCount) return [];


  const baseRobotQueue: BuildQueue[] = [];

  baseRobotQueue.push({...initOreCountObject(), [Ore.ORE]: 1})
  baseRobotQueue.push({...initOreCountObject(), [Ore.CLAY]: 1})
  if (inventory.robots[Ore.CLAY] > 0) {
    baseRobotQueue.push({...initOreCountObject(), [Ore.OBSIDIAN]: 1})
    if (inventory.robots[Ore.OBSIDIAN] > 0) {
      baseRobotQueue.push({...initOreCountObject(), [Ore.GEODE]: 1})
    }
  }

  const resultRobotRounds: RobotRound[] = [];

  baseRobotQueue.forEach(rq => {
    let minutesToBuild = minutesToBuildQueue(b, rq, inventory);
    if (minutesToBuild + minute < maxMinuteCount) {
      const newInventory = runMinutesAndBuild(b, minutesToBuild, rq, inventory);
      const robotRound: RobotRound = {
        minute: minute + minutesToBuild,
        maxGeodeCount: newInventory.ores[Ore.GEODE],
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

const runBlueprint = (b: Blueprint) => {
  console.log("==== BLUEPRINT STARTED ==== ", b.id);
  const baseRoundNode: RobotRoundListNode = {
    next: undefined,
    round: {
      minute: 0,
      maxGeodeCount: 0,
      inventory: clone(initInventory()),
    }
  };

  const start = Date.now();

  const roundLinkedList: RobotRoundList = {
    head: baseRoundNode,
    tail: baseRoundNode,
  };

  let maxGeodeCount = 0;
  roundCountTotal = 0;
  maxMinuteCount = 24;
  roundCache = {};

  while (roundLinkedList.head) {
    const round = roundLinkedList.head.round;
    // console.log("================= MINUTE: ", round.minute);
    // console.log("==ROBOTS: ", logNiceOres(round.inventory.robots));
    // console.log("==ORES:   ", logNiceOres(round.inventory.ores));
    // console.log("===========================================");

    if (round.inventory.robots[Ore.GEODE] > 0) {
      const minDiff = maxMinuteCount - round.minute;
      const geodesInTheEnd = round.maxGeodeCount + minDiff * round.inventory.robots[Ore.GEODE];
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

  b.forEach(blueprint => {
    runBlueprint(blueprint);
    qualityLevel += (blueprint.id * blueprint.geodes);
  });

  console.log("RESULT ========= ", qualityLevel);
}
