#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

if ! [ -x "$(command -v toml)" ]; then
  echo 'Error: toml not instlaled! Instal with: cargo install toml-cli'
  exit 1
fi

export RPC_URL=$(toml get Scarb.toml --raw tool.dojo.env.rpc_url)
export ACCOUNT_ADDRESS=$(toml get Scarb.toml --raw tool.dojo.env.account_address)
export ACTIONS_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "loot_underworld::systems::mint_chamber::mint_chamber" ).address')
export WORLD_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.world.address')

export COMPONENTS=("Chamber" "Map" "State" "Tile" )

echo "---------------------------------------------------------------------------"
echo "sozo auth writer"
echo "RPC        : $RPC_URL"
echo "world      : $WORLD_ADDRESS"
echo "account    : $ACCOUNT_ADDRESS"
echo "actions    : $ACTIONS_ADDRESS"
echo "components : ${COMPONENTS[*]}"
echo "---------------------------------------------------------------------------"

for component in ${COMPONENTS[@]}; do
  sozo auth writer --world $WORLD_ADDRESS --rpc-url $RPC_URL $component $ACTIONS_ADDRESS --account-address $ACCOUNT_ADDRESS
done

echo "Default authorizations have been successfully set! 👍"
