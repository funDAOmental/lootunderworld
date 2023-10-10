import { Components, Entity, Schema, setComponent } from "@latticexyz/recs";
import { poseidonHashMany } from "micro-starknet";
import { Direction } from "../dojo/createSystemCalls";

export function isValidArray(input: any): input is any[] {
  return Array.isArray(input) && input != null;
}

export function getFirstComponentByType(entities: any[] | null | undefined, typename: string): any | null {
  if (!isValidArray(entities)) return null;

  for (let entity of entities) {
    if (isValidArray(entity?.node.components)) {
      const foundComponent = entity.node.components.find((comp: any) => comp.__typename === typename);
      if (foundComponent) return foundComponent;
    }
  }

  return null;
}

export function extractAndCleanKey(entities?: any[] | null | undefined): string | bigint | null {
  if (!isValidArray(entities) || !entities[0]?.keys) return null;

  return entities[0].keys.replace(/,/g, '');
}

export function updatePositionWithDirection(direction: Direction, value: { x: number, y: number }) {
  switch (direction) {
    case Direction.Left:
      value.x--;
      break;
    case Direction.Right:
      value.x++;
      break;
    case Direction.Up:
      value.y--;
      break;
    case Direction.Down:
      value.y++;
      break;
    default:
      throw new Error("Invalid direction provided");
  }
  return value;
}

// DISCUSSION: MUD expects Numbers, but entities in Starknet are BigInts (from poseidon hash)
// so I am converting them to Numbers here, but it means that there is a bigger risk of collisions
export function getEntityIdFromKeys(keys: bigint[]): Entity {
  if (keys.length === 1) {
    return ('0x' + BigInt(keys[0]).toString(16)) as Entity;
  }
  // calculate the poseidon hash of the keys
  let poseidon = poseidonHashMany([BigInt(keys.length), ...keys]);
  return ('0x' + BigInt(poseidon).toString(16)) as Entity;
}

//-------------------
// From Eternum
// https://github.com/BibliothecaDAO/eternum/blob/main/client/src/utils/utils.tsx
//

type DojoEntity = {
  __typename?: "Entity";
  keys?: (string | bigint | null)[] | null | undefined;
  components?: any | null[];
};

export function setComponentFromEntity(entity: DojoEntity | null, componentName: string, components: Components) {
  if (entity) {
    let component = components[componentName];
    let rawComponentValues = entity?.components?.find((component: any) => {
      return component?.__typename === componentName;
    });
    if (rawComponentValues) {
      // setting the component values
      // console.log(`SET entity:`, entity)
      // let keys = entity?.keys ? extractAndCleanKey(entity.keys) : [];
      let keys = entity?.keys ?? [];
      let entityId = getEntityIdFromKeys(keys as bigint[]);
      // TODO: issue is that torii returns all numbers as strings, need to fix in torii
      // so here i am transforming to a number each time (but it will cause problem for fields that are not numbers)
      const componentValues = Object.keys(component.schema).reduce((acc: Schema, key) => {
        const value = rawComponentValues[key];
        acc[key] = Number(value);
        return acc;
      }, {});
      console.log(`SET_[${componentName}]_keys,entityId,values:`, keys, entityId, componentValues)
      console.log(`SET_[${componentName}]_component:`, component)
      setComponent(component, entityId, componentValues);
    }
  }
}

export const numberToHex = (num: number) => {
  return "0x" + num.toString(16);
};

export function strTofelt252Felt(str: string): string {
  const encoder = new TextEncoder();
  const strB = encoder.encode(str);
  return BigInt(
    strB.reduce((memo, byte) => {
      memo += byte.toString(16);
      return memo;
    }, "0x"),
  ).toString();
}


