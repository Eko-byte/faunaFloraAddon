var fs = require("fs");

let flowers = JSON.parse(fs.readFileSync("data.json"))
console.log(flowers)

flowers.forEach((v) => createJSON(v));

function createJSON(flowerType) {
  function titleCase(str) {
    var splitStr = str.replace(/_/g, " ").split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }
  var flowerTypeBoquet = flowerType + "boquet";
  var ffFlowerTypeBoquet = "ff" + flowerType + "boquet";
  var langName = titleCase(flowerType);
  let blockData = {
    format_version: "1.16.100",
    "minecraft:block": {
      description: {
        identifier: `ff:${flowerType}_boquet`,
      },
      components: {
        "minecraft:placement_filter": {
          conditions: [
            {
              allowed_faces: ["up"],
              block_filter: [
                "minecraft:grass",
                "minecraft:dirt",
                "minecraft:podzol",
                "minecraft:moss_block",
              ],
            },
          ],
        },
        "minecraft:loot": `loot_tables/blocks/${flowerType}_boquet.json`,
        "minecraft:geometry": "geometry.large_fern",
        "minecraft:material_instances": {
          "*": {
            render_method: "alpha_test",
            texture: `${flowerType}_boquet`,
            face_dimming: false,
            ambient_occlusion: false,
          },
        },
        "minecraft:entity_collision": false,
        "minecraft:block_light_absorption": 0,
        "minecraft:destroy_time": 0,
        "minecraft:breathability": "air",
        "minecraft:breakonpush": true,
        "minecraft:on_interact": {
          condition: "q.get_equipped_item_name=='bone_meal'",
          event: "fertilize_block",
        },
      },
      events: {
        fertilize_block: {
          spawn_loot: {
            table: `loot_tables/blocks/${flowerType}_boquet.json`,
          },
          decrement_stack: {},
          run_command: {
            command: ["particle minecraft:crop_growth_emitter ~ ~ ~"],
          },
        },
      },
    },
  };
  let itemData = {
    format_version: "1.16.100",
    "minecraft:item": {
      description: {
        identifier: `ff:${flowerType}_boquet_item`,
        category: "nature",
      },
      components: {
        "minecraft:block_placer": {
          block: `ff:${flowerType}_boquet`,
          use_on: ["grass", "dirt", "podzol", "moss_block", "dirt_with_roots"],
        },
        "minecraft:icon": { texture: `${flowerType}_boquet` },
        "minecraft:creative_category": { parent: "itemGroup.name.flower" },
        "tag:flower": {},
        "minecraft:max_stack_size": 64,
        "minecraft:stacked_by_data": true,
        "minecraft:on_use_on": { on_use_on: { event: "sound" } },
      },
      events: {
        sound: {
          run_command: {
            command: ["playsound dig.grass @a[r=5] ~ ~ ~ 0.4 1.0"],
          },
        },
      },
    },
  };
  let featureData = {
    format_version: "1.13.0",
    "minecraft:single_block_feature": {
      description: { identifier: `ff:${flowerType}/${flowerType}_boquet_feature` },
      places_block: { name: `ff:${flowerType}_boquet` },
      enforce_survivability_rules: true,
      enforce_placement_rules: true,
    },
  };
  let lootData = {
    pools: [
      {
        rolls: 1,
        entries: [
          {
            type: "item",
            name: `ff:${flowerType}_large_item`,
            weight: 1,
            functions: [{ function: "set_count", count: { min: 1, max: 1 } }],
          },
        ],
      },
    ],
  };
  let terrainData = {
    texture_data: {
      [`${flowerTypeBoquet}`]: {
        textures: `textures/blocks/${flowerType}/${flowerTypeBoquet}`,
      },
    },
  };
  let itemTextureData = {
    texture_data: {
      [`${flowerTypeBoquet}`]: {
        textures: `textures/items/${flowerType}/${flowerTypeBoquet}`,
      },
    },
  };
  let langData = `item.ff:${flowerType}_item=${langName} Boquet`;
  fs.writeFileSync(
    `BP/blocks/${flowerType}/${flowerType}_boquet.json`,
    JSON.stringify(blockData)
  );
  fs.writeFileSync(
    `BP/items/${flowerType}/${flowerType}_boquet.json`,
    JSON.stringify(itemData)
  );
  fs.writeFileSync(
    `BP/features/${flowerType}/${flowerType}_boquet_feature.json`,
    JSON.stringify(featureData)
  );
  fs.writeFileSync(
    `BP/loot_tables/${flowerType}/${flowerType}_boquet.json`,
    JSON.stringify(lootData)
  );
  fs.appendFileSync(`RP/texts/en_US.lang`, langData);
  fs.appendFileSync(
    `RP/blocks.json`,
    JSON.stringify({
      [`${ffFlowerTypeBoquet}`]: {
        sound: "grass",
      },
    })
  );
  fs.appendFileSync(
    `RP/textures/terrain_texture.json`,
    JSON.stringify(terrainData)
  );
  fs.appendFileSync(
    `RP/textures/item_texture.json`,
    JSON.stringify(itemTextureData)
  );
}
