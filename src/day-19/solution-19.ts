import {enumKeys, enumValues} from "../utils/enumKeys";

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
  robot: Record<Ore, Robot>,
}

type RobotRound = {
  minute: number,
  maxGeodeCount: number,
  inventory: Inventory,
}

type BuildQueue = Record<Ore, number>;
type QueueWithInventory = {
  queue: BuildQueue,
  inventory: Inventory,
}

let b: Blueprint[] = [];
let roundCountTotal = 0;
let maxMinuteCount = 10;
let roundCache: Record<string, boolean> = {};
let hasResourcesCache: Record<string, boolean> = {};
let hadBetterResources: Record<string, Record<Ore, number>> = {};

const getOreCachePart = (i: Record<Ore, number>) => `${i[Ore.ORE]}x${i[Ore.CLAY]}x${i[Ore.OBSIDIAN]}x${i[Ore.GEODE]}`;
const getBetterResourcesCacheKey = (min: number, i: Inventory) => `${min}x${getOreCachePart(i.robots)}`;

const compareInventoryResources = (min: number, i: Inventory): boolean => {
  const cacheKey = getBetterResourcesCacheKey(min, i);
  let result = hadBetterResources[cacheKey];
  if (result === undefined) {
    result = i.ores;
    hadBetterResources[cacheKey] = result;
    return false;
  } else {
    const haveBetter = result[Ore.ORE] <= i.ores[Ore.ORE] && result[Ore.CLAY] <= i.ores[Ore.CLAY] && result[Ore.OBSIDIAN] <= i.ores[Ore.OBSIDIAN] && result[Ore.GEODE] <= i.ores[Ore.GEODE];
    if (haveBetter) {
      hadBetterResources[cacheKey] = i.ores;
      return true;
    }
  }
  return false;
}

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
const initBuildQueue = (): BuildQueue => ({
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

const compareBuildQueues = (a: BuildQueue, b: BuildQueue): boolean => Object.keys(a).reduce((p, c) => !p ? false : a[c as unknown as Ore] === b[c as unknown as Ore], true);


/*const hasResourcesForRobotCache  = (b: Blueprint, type: Ore, inventory: Inventory) => {
  const hasResourcesCacheKey = `${type}x${inventory.ores[Ore.ORE]}x${inventory.ores[Ore.CLAY]}x${inventory.ores[Ore.OBSIDIAN]}`;
  let result = hasResourcesCache[hasResourcesCacheKey];
  if (result === undefined) {
    result = b.robot[type].cost.reduce((p, c) => !p ? false : c.count <= inventory.ores[c.ore], true);
    hasResourcesCache[hasResourcesCacheKey] = result;
  }
  return result;
};*/

const hasResourcesForRobot = (b: Blueprint, type: Ore, inventory: Inventory) => b.robot[type].cost.reduce((p, c) => !p ? false : c.count <= inventory.ores[c.ore], true);

const addRobotToConstructionQueueAndTakeResources = (b: Blueprint, type: Ore, oldQueue: QueueWithInventory): QueueWithInventory => {
  const newQueue = clone(oldQueue);
  b.robot[type].cost.forEach(r => newQueue.inventory.ores[r.ore] -= r.count);
  newQueue.queue[type]++;

  return newQueue;
}

const newBuildQueueAlreadyExists = (n: BuildQueue, existing: BuildQueue[]): boolean => existing.find(e => compareBuildQueues(n, e)) !== undefined;

const addResourceToQueueWithInventory = (q: QueueWithInventory) => enumKeys(Ore).forEach(o => q.inventory.ores[Ore[o]] += q.inventory.robots[Ore[o]]);
const finishConstructionRobotsInQueueWithInventory = (q: QueueWithInventory) => enumKeys(Ore).forEach(o => q.inventory.robots[Ore[o]] += q.queue[Ore[o]]);

const getRobotCost = (b: Blueprint, robotType: Ore, materialType: Ore) => b.robot[robotType].cost.find(c => c.ore === materialType)?.count ?? 0;

const cacheMaximums = (b: Blueprint) => {
  const oreClayRobotOreCost = Math.max(getRobotCost(b, Ore.ORE, Ore.ORE), getRobotCost(b, Ore.CLAY, Ore.ORE));
  const oreClayObsidianRobotOreCost = Math.max(oreClayRobotOreCost, getRobotCost(b, Ore.OBSIDIAN, Ore.ORE));
  const obsidianRobotClayCost = getRobotCost(b, Ore.OBSIDIAN, Ore.CLAY);
  return {
    oreClayRobotOreCost,
    oreClayObsidianRobotOreCost,
    obsidianRobotClayCost,
  }
}

let cachedMaximums: ReturnType<typeof cacheMaximums> = {
  oreClayRobotOreCost: 0,
  oreClayObsidianRobotOreCost: 0,
  obsidianRobotClayCost: 0,
};

const hasNoReasonToWait = (b: Blueprint, q: QueueWithInventory): boolean => {
  if(q.inventory.robots[Ore.CLAY] === 0) return q.inventory.ores[Ore.ORE] >= cachedMaximums.oreClayRobotOreCost;
  return q.inventory.ores[Ore.ORE] >= cachedMaximums.oreClayObsidianRobotOreCost && q.inventory.ores[Ore.CLAY] >= cachedMaximums.obsidianRobotClayCost;
  // if(q.inventory.robots[Ore.OBSIDIAN] === 0) return q.inventory.robots[Ore.ORE] >= cachedMaximums.oreClayObsidianRobotOreCost && q.inventory.robots[Ore.CLAY] >= cachedMaximums.obsidianRobotClayCost;
  // return q.inventory.robots[Ore.ORE] >= cachedMaximums.oreClayRobotOreCost + getRobotCost(b, Ore.OBSIDIAN, Ore.ORE);
}

const cacheRobotRoundKey = (r: RobotRound) => `${r.minute}x${r.maxGeodeCount}x${r.inventory.robots[Ore.ORE]}x${r.inventory.robots[Ore.CLAY]}x${r.inventory.robots[Ore.OBSIDIAN]}x${r.inventory.robots[Ore.GEODE]}x${r.inventory.ores[Ore.ORE]}x${r.inventory.ores[Ore.CLAY]}x${r.inventory.ores[Ore.OBSIDIAN]}x${r.inventory.ores[Ore.GEODE]}`;

const runRound = ({minute, maxGeodeCount, inventory}: RobotRound, b: Blueprint): RobotRound[] => {
  roundCountTotal++;
  let newMin = minute + 1;
  let newMaxGeodes = maxGeodeCount;

  if (newMin > maxMinuteCount) {
    // if (inventory.robots[Ore.OBSIDIAN] > 1) console.log(`Result ${roundCountTotal}: `, inventory.robots, inventory.ores)
    return [];
  }

  if (compareInventoryResources(newMin, inventory)) return [];

  const buildQueues: QueueWithInventory[] = [{
    queue: initBuildQueue(),
    inventory: clone(inventory),
  }];

  let addedToQueue = false;
  do {
    addedToQueue = false;
    buildQueues.forEach(q => {
      enumKeys(Ore).forEach(o => {
        if(hasResourcesForRobot(b, Ore[o], q.inventory)) {
          const newBuildQueue: QueueWithInventory = addRobotToConstructionQueueAndTakeResources(b, Ore[o], q);
          if (!newBuildQueueAlreadyExists(newBuildQueue.queue, buildQueues.map(bq => bq.queue))) {
            buildQueues.push(newBuildQueue);
            addedToQueue = true;
          }
        }
      })
    })
  } while(addedToQueue);

  if (buildQueues.length > 1 && hasNoReasonToWait(b, buildQueues[0])) buildQueues.shift();

  buildQueues.forEach(q => {
    addResourceToQueueWithInventory(q);
    finishConstructionRobotsInQueueWithInventory(q);
  })

  const resultBuildQueues: RobotRound[] = [];

  buildQueues.forEach(q => {
    const robotRound: RobotRound = {minute: newMin, maxGeodeCount: q.inventory.ores[Ore.GEODE], inventory: q.inventory};
    const robotRoundCacheKey = cacheRobotRoundKey(robotRound);
    if (roundCache[robotRoundCacheKey] === undefined) {
      roundCache[robotRoundCacheKey] = true;
      resultBuildQueues.push(robotRound);
    }
  });

  return resultBuildQueues;
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
  const baseRoundNode: RobotRoundListNode = {
    next: undefined,
    round: {
      minute: 0,
      maxGeodeCount: 0,
      inventory: initInventory()
    }
  };

  const start = Date.now();

  const roundLinkedList: RobotRoundList = {
    head: baseRoundNode,
    tail: baseRoundNode,
  };

  let maxGeodeCount = 0;
  maxMinuteCount = 19;
  cachedMaximums = cacheMaximums(b);

  while (roundLinkedList.head) {
    const round = roundLinkedList.head.round;

    if (round.maxGeodeCount > maxGeodeCount) {
      maxGeodeCount = round.maxGeodeCount
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

  console.log("Total rounds: ", roundCountTotal, "; Max geode count: ", maxGeodeCount);
}

exports.solution = (input: string[]) => {
  parseBlueprints(input);

  runBlueprint(b[0])


}


/*

  const testQueue1: BuildQueue = {
    [Ore.ORE]: 1,
    [Ore.CLAY]: 1,
    [Ore.OBSIDIAN]: 1,
    [Ore.GEODE]: 1,
  };

  const testQueue2: BuildQueue = {
    [Ore.ORE]: 1,
    [Ore.CLAY]: 1,
    [Ore.OBSIDIAN]: 1,
    [Ore.GEODE]: 0,
  };

  const testQueue3: BuildQueue = {
    [Ore.ORE]: 1,
    [Ore.CLAY]: 1,
    [Ore.OBSIDIAN]: 1,
    [Ore.GEODE]: 2,
  };
 */