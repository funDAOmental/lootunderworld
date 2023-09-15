//@ts-ignore : vscode bug on moduleResolution: "bundler"
import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents }: SetupNetworkResult) {
  return {
    ...contractComponents,
    // Loot Underworld
    Chamber: overridableComponent(contractComponents.Chamber),
    Map: overridableComponent(contractComponents.Map),
    Door: overridableComponent(contractComponents.Door),
    // Example
    Position: overridableComponent(contractComponents.Position),
    Moves: overridableComponent(contractComponents.Moves),
  };
}