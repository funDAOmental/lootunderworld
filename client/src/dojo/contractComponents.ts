/* Autogenerated file. Do not edit manually. */

//@ts-ignore
import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    Moves: (() => {
      const name = "Moves";
      return defineComponent(
        world,
        {
          remaining: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Position: (() => {
      const name = "Position";
      return defineComponent(
        world,
        {
          x: RecsType.Number,
          y: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Chamber: (() => {
      const name = "Chamber";
      return defineComponent(
        world,
        {
          realm_id: RecsType.BigNumber,
          location: RecsType.BigNumber,
          seed: RecsType.BigNumber,
          minter: RecsType.BigNumber,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Map: (() => {
      const name = "Map";
      return defineComponent(
        world,
        {
          bitmap: RecsType.BigNumber,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Door: (() => {
      const name = "Door";
      return defineComponent(
        world,
        {
          pos: RecsType.Number,
          toLocation: RecsType.BigNumber,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
  };
}
