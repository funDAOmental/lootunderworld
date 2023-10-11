use debug::PrintTrait;
use traits::{Into, TryInto};

use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use loot_underworld::systems::actions::create_door::{create_doors};
use loot_underworld::components::chamber::{Chamber, Map, Doors};
use loot_underworld::core::randomizer::{randomize_door_permissions};
use loot_underworld::types::location::{Location, LocationTrait};
use loot_underworld::types::dir::{Dir, DirTrait};
use loot_underworld::core::seeder::{make_seed};
use loot_underworld::core::generator::{generate};


#[inline(always)]
fn generate_chamber(world: IWorldDispatcher,
    caller: ContractAddress,
    from_location: Location,
    from_dir: Dir,
    mut generatorName: felt252,
    mut generatorValue: u32,
) -> u128 {

    let from_chamber = get!(world, from_location.to_id(), (Chamber));

    if(from_location.under == 0 && from_location.under == 0) {
        // this is a new Entry from the surface
        assert(from_location.validate_entry() == true, 'Invalid Entry from_location');
        assert(from_chamber.yonder == 0, 'Entry from_chamber exist!?');
        generatorName = 'entry';
        generatorValue = 0;
    } else {
        // else, from_chamber must exist
        assert(from_location.validate() == true, 'Invalid from_location');
        assert(from_chamber.yonder > 0, 'from_chamber does not exist');
    }

    // Shift to location
    let chamber_location: Location = from_location.offset(from_dir);
    assert(chamber_location.validate() == true, 'Invalid chamber_location');

    // assert chamber is new
    let location_id: u128 = chamber_location.to_id();
    let chamber = get!(world, location_id, (Chamber));
    assert(chamber.yonder == 0, 'Chamber already exists');


    //---------------------
    // Chamber
    //
    let seed: u256 = make_seed(chamber_location.token_id.into(), location_id);

    // increment yonder
    let yonder: u16 = from_chamber.yonder + 1;


    //---------------------
    // Doors
    //
    let entry_dir: Dir = from_dir.flip();
    let permissions: u8 = randomize_door_permissions(seed);
    let (doors, protected): (Doors, u256) = create_doors(world, chamber_location, location_id, seed, entry_dir, permissions);


    //---------------------
    // Generate Bitmap
    //
    let bitmap: u256= generate(seed, protected, entry_dir, generatorName, generatorValue);
    assert(bitmap != 0, 'Chamber is empty');

    //---------------------
    // Map Component
    //
    set!(world, (
        Chamber {
            location_id,
            seed,
            minter: caller,
            domain_id: chamber_location.domain_id,
            token_id: chamber_location.token_id,
            yonder,
        },
        Map {
            entity_id: location_id,
            bitmap,
            generatorName,
            generatorValue,
        },
        doors,
    ) );

    location_id
}
