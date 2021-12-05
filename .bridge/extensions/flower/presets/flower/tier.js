module.exports = async ({ createFile, expandFile, models }) => {
  const { IDENTIFIER, DYE, TIER, IDENTIFIER_NAME } = models;

  if (TIER >= 1) {
    var blockData1 = {
      format_version: "1.16.100",
      "minecraft:block": {
        description: {
          identifier: `ff:${IDENTIFIER}`,
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
                  "minecraft:dirt_with_roots",
                ],
              },
            ],
          },
          "minecraft:loot": `loot_tables/blocks/${IDENTIFIER}/${IDENTIFIER}.json`,
          "minecraft:geometry": "geometry.cross",
          "minecraft:material_instances": {
            "*": {
              render_method: "alpha_test",
              texture: `${IDENTIFIER}`,
              face_dimming: false,
              ambient_occlusion: false,
            },
          },
          "minecraft:entity_collision": false,
          "minecraft:block_light_absorption": 0,
          "minecraft:destroy_time": 0,
          "minecraft:breathability": "air",
          "tag:flower": {},
          "minecraft:breakonpush": true,
          "minecraft:pick_collision": {
            origin: [-3.5, 0, -3.5],
            size: [7, 10, 7],
          },
        },
        events: {},
      },
    };
    var recipeData = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:dye_from_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_item`
          }
        ],
        "result": {
          "item": "minecraft:dye",
          "data": DYE
        }
      }
    };
    var langData1 = `item.ff:${IDENTIFIER}_item=${IDENTIFIER_NAME}`;

    await createFile(`BP/blocks/${IDENTIFIER}/${IDENTIFIER}.json`, JSON.stringify(blockData1));
    await createFile(`BP/recipes/${IDENTIFIER}/${IDENTIFIER}_dye.json`, JSON.stringify(recipeData));
    await expandFile(`RP/texts/en_US.lang`, langData1)
    await expandFile(`RP/blocks.json`, {
      [`ff:${IDENTIFIER}`]: {
        sound: "grass",
      },
    })
    await expandFile("RP/textures/terrain_texture.json", {
      texture_data: {
        [`${IDENTIFIER}`]: {
          textures: `textures/blocks/${IDENTIFIER}/${IDENTIFIER}`,
        },
      },
    });
    await expandFile("RP/textures/item_texture.json", {
      texture_data: {
        [`${IDENTIFIER}`]: {
          textures: `textures/blocks/${IDENTIFIER}/${IDENTIFIER}`,
        },
      },
    });
  }
  if (TIER >= 2) {
    var blockData2 = {
      format_version: "1.16.100",
      "minecraft:block": {
        description: {
          identifier: `ff:${IDENTIFIER}_tall`,
          properties: {
            "ff:upper_bit": [0, 1],
          },
        },
        permutations: [
          {
            condition: "query.block_property('ff:upper_bit') == 0",
            components: {
              "minecraft:on_player_destroyed": {
                event: "destroy_top",
              },
              "minecraft:pick_collision": {
                origin: [-3.5, 0, -3.5],
                size: [7, 16, 7],
              },
              "minecraft:loot": `loot_tables/blocks/${IDENTIFIER}/${IDENTIFIER}_tall.json`,
            },
          },
          {
            condition: "query.block_property('ff:upper_bit') == 1",
            components: {
              "tag:flower_top": {},
              "minecraft:material_instances": {
                "*": {
                  render_method: "alpha_test",
                  texture: "nothing",
                  face_dimming: false,
                  ambient_occlusion: false,
                },
              },
              "minecraft:on_player_destroyed": {
                event: "destroy_bottom",
              },
              "minecraft:pick_collision": {
                origin: [-3.5, 0, -3.5],
                size: [7, 10, 7],
              },
            },
          },
        ],
        components: {
          "minecraft:loot": "loot_tables/empty.json",
          "tag:flower_bottom": {},
          "minecraft:placement_filter": {
            conditions: [
              {
                allowed_faces: ["up"],
                block_filter: [
                  "minecraft:grass",
                  "minecraft:dirt",
                  "minecraft:podzol",
                  "minecraft:dirt_with_roots",
                  `ff:${IDENTIFIER}_tall`,
                  "moss_block",
                ],
              },
            ],
          },
          "minecraft:geometry": "geometry.double_cross",
          "minecraft:breathability": "air",
          "tag:flower": {},
          "minecraft:breakonpush": true,
          "minecraft:material_instances": {
            "*": {
              render_method: "alpha_test",
              texture: `${IDENTIFIER}_tall`,
              face_dimming: false,
              ambient_occlusion: false,
            },
          },
          "minecraft:block_light_emission": 0.14,
          "minecraft:entity_collision": false,
          "minecraft:block_light_absorption": 0,
          "minecraft:destroy_time": 0,
          "minecraft:on_interact": {
            condition: "q.get_equipped_item_name=='bone_meal'",
            event: "fertilize_block",
          },
          "minecraft:on_placed": {
            event: "check_for_bottom",
          },
        },
        events: {
          check_for_bottom: {
            sequence: [
              {
                condition:
                  "q.block_neighbor_has_all_tags(0,-1,0,'flower_bottom')",
                set_block_property: {
                  "ff:upper_bit": 1,
                },
              },
              {
                trigger: {
                  event: "add_top",
                  target: "self",
                },
              },
            ],
          },
          add_top: {
            sequence: [
              {
                condition: "!query.block_property('ff:upper_bit') == 1",
                set_block_at_pos: {
                  block_offset: [0, 1, 0],
                  block_type: `ff:${IDENTIFIER}_tall`,
                },
              },
            ],
          },
          destroy_top: {
            run_command: {
              command: "fill ~ ~1 ~ ~ ~1 ~ air 0 destroy",
            },
          },
          destroy_bottom: {
            run_command: {
              command: ["fill ~ ~-1 ~ ~ ~-1 ~ air 0 destroy"],
            },
          },
          fertilize_block: {
            spawn_loot: {
              table: `loot_tables/blocks/${IDENTIFIER}/${IDENTIFIER}_tall.json`,
            },
            decrement_stack: {},
            run_command: {
              command: ["particle minecraft:crop_growth_emitter ~ ~ ~"],
            },
          },
        },
      },
    };
    var tallIntoShort = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:tall_${IDENTIFIER}_into_short_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_tall_item`
          }
        ],
        "result": {
          "item": `ff:${IDENTIFIER}_item`,
          "count": 2
        }
      }
    };
    var shortIntoTall = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:short_${IDENTIFIER}_into_tall_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_item`,
            "count": 2
          }
        ],
        "result": {
          "item": `ff:${IDENTIFIER}_tall_item`
        }
      }
    }
    var langData2 = `item.ff:${IDENTIFIER}_tall_item=Tall ${IDENTIFIER_NAME}`;
    
    await createFile(`BP/blocks/${IDENTIFIER}/${IDENTIFIER}_tall.json`, JSON.stringify(blockData2));
    await createFile(`BP/recipes/${IDENTIFIER}/tall_into_short.json`, JSON.stringify(tallIntoShort));
    await createFile(`BP/recipes/${IDENTIFIER}/short_into_tall.json`, JSON.stringify(shortIntoTall));
    await expandFile(`RP/texts/en_US.lang`, langData2)
    await expandFile(`RP/blocks.json`, {
      [`ff:${IDENTIFIER}_tall`]: {
        sound: "grass",
      },
    })
    await expandFile("RP/textures/terrain_texture.json", {
      texture_data: {
        [`${IDENTIFIER}_tall`]: {
          textures: `textures/blocks/${IDENTIFIER}/${IDENTIFIER}_tall`,
        },
      },
    });
    await expandFile("RP/textures/item_texture.json", {
      texture_data: {
        [`${IDENTIFIER}_tall`]: {
          textures: `textures/items/${IDENTIFIER}/${IDENTIFIER}_tall`,
        },
      },
    });
  }
  if (TIER >= 3) {
    var blockData3 = {
      format_version: "1.16.100",
      "minecraft:block": {
        description: {
          identifier: `ff:${IDENTIFIER}_large`,
        },
        components: {
          "minecraft:pick_collision": {
            origin: [-7, 0, -7],
            size: [14, 16, 14],
          },
          "minecraft:placement_filter": {
            conditions: [
              {
                allowed_faces: ["up"],
                block_filter: [
                  "minecraft:grass",
                  "minecraft:dirt",
                  "minecraft:podzol",
                  "minecraft:moss_block",
                  "minecraft:dirt_with_roots",
                ],
              },
            ],
          },
          "minecraft:geometry": "geometry.blue_bell",
          "minecraft:breathability": "air",
          "tag:flower": {},
          "minecraft:breakonpush": true,
          "minecraft:material_instances": {
            "*": {
              render_method: "alpha_test",
              texture: `${IDENTIFIER}_large`,
              face_dimming: false,
              ambient_occlusion: false,
            },
          },
          "minecraft:block_light_emission": 0.14,
          "minecraft:entity_collision": false,
          "minecraft:block_light_absorption": 0,
          "minecraft:destroy_time": 0,
          "minecraft:loot": `loot_tables/blocks/${IDENTIFIER}/${IDENTIFIER}_large.json`,
          "minecraft:on_interact": {
            condition: "q.get_equipped_item_name=='bone_meal'",
            event: "fertilize_block",
          },
        },
        events: {
          fertilize_block: {
            spawn_loot: {
              table: `loot_tables/blocks/${IDENTIFIER}/${IDENTIFIER}_large.json`,
            },
            decrement_stack: {},
            run_command: {
              command: ["particle minecraft:crop_growth_emitter ~ ~ ~"],
            },
          },
        },
      },
    };
    var largeIntoTall = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:large_${IDENTIFIER}_into_tall_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_large_item`
          }
        ],
        "result": {
          "item": `ff:${IDENTIFIER}_tall_item`,
          "count": 2
        }
      }
    };
    var tallIntoLarge = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:tall_${IDENTIFIER}_into_large_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_tall_item`,
            "count": 2
          }
        ],
        "result": {
          "item": `ff:${IDENTIFIER}_large_item`
        }
      }
    }
    var langData3 = `item.ff:${IDENTIFIER}_large_item=Large ${IDENTIFIER_NAME}`;
        
    await createFile(`BP/blocks/${IDENTIFIER}/${IDENTIFIER}_large.json`, JSON.stringify(blockData3));
    await createFile(`BP/recipes/${IDENTIFIER}/large_into_tall.json`, JSON.stringify(largeIntoTall));
    await createFile(`BP/recipes/${IDENTIFIER}/tall_into_large.json`, JSON.stringify(tallIntoLarge));
    await expandFile(`RP/texts/en_US.lang`, langData3)
    await expandFile(`RP/blocks.json`, {
      [`ff:${IDENTIFIER}_large`]: {
        sound: "grass",
      },
    })
    await expandFile("RP/textures/terrain_texture.json", {
      texture_data: {
        [`${IDENTIFIER}_large`]: {
          textures: `textures/blocks/${IDENTIFIER}/${IDENTIFIER}_large`,
        },
      },
    });
    await expandFile("RP/textures/item_texture.json", {
      texture_data: {
        [`${IDENTIFIER}_large`]: {
          textures: `textures/items/${IDENTIFIER}/${IDENTIFIER}_large`,
        },
      },
    });
  }
  if (TIER === 4) {
    var blockData4 = {
      format_version: "1.16.100",
      "minecraft:block": {
        description: {
          identifier: `ff:${IDENTIFIER}_short`,
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
                  "minecraft:dirt_with_roots",
                ],
              },
            ],
          },
          "minecraft:loot": `loot_tables/blocks/${IDENTIFIER}/${IDENTIFIER}_short.json`,
          "minecraft:geometry": "geometry.cross",
          "minecraft:material_instances": {
            "*": {
              render_method: "alpha_test",
              texture: `${IDENTIFIER}_short`,
              face_dimming: false,
              ambient_occlusion: false,
            },
          },
          "minecraft:entity_collision": false,
          "minecraft:block_light_absorption": 0,
          "minecraft:destroy_time": 0,
          "minecraft:breathability": "air",
          "tag:flower": {},
          "minecraft:breakonpush": true,
          "minecraft:pick_collision": {
            origin: [-3.5, 0, -3.5],
            size: [7, 10, 7],
          },
        },
        events: {},
      },
    };
    var shortIntoNormal = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:short_${IDENTIFIER}_into_normal_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_short_item`
          }
        ],
        "result": {
          "item": `ff:${IDENTIFIER}_item`,
          "count": 2
        }
      }
    };
    var normalIntoShort = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:normal_${IDENTIFIER}_into_short_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_item`,
            "count": 2
          }
        ],
        "result": {
          "item": `ff:${IDENTIFIER}_short_item`
        }
      }
    }
    var tallIntoShort = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:tall_${IDENTIFIER}_into_short_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_tall_item`
          }
        ],
        "result": {
          "item": `ff:${IDENTIFIER}_short_item`,
          "count": 2
        }
      }
    };
    var shortIntoTall = {
      "format_version": 1.12,
      "minecraft:recipe_shapeless": {
        "description": {
          "identifier": `ff:short_${IDENTIFIER}_into_tall_${IDENTIFIER}`
        },
        "tags": [
          "crafting_table"
        ],
        "ingredients": [
          {
            "item": `ff:${IDENTIFIER}_short_item`,
            "count": 2
          }
        ],
        "result": {
          "item": `ff:${IDENTIFIER}_tall_item`
        }
      }
    }
    var langData4 = `item.ff:${IDENTIFIER}_short_item=Short ${IDENTIFIER_NAME}`;
    
    await createFile(`BP/blocks/${IDENTIFIER}/${IDENTIFIER}_short.json`, JSON.stringify(blockData4));
    await createFile(`BP/recipes/${IDENTIFIER}/tall_into_short.json`, JSON.stringify(tallIntoShort));
    await createFile(`BP/recipes/${IDENTIFIER}/short_into_tall.json`, JSON.stringify(shortIntoTall));
    await createFile(`BP/recipes/${IDENTIFIER}/short_into_normal.json`, JSON.stringify(shortIntoNormal));
    await createFile(`BP/recipes/${IDENTIFIER}/normal_into_short.json`, JSON.stringify(normalIntoShort));
    await expandFile(`RP/texts/en_US.lang`, langData4)
    await expandFile(`RP/blocks.json`, {
      [`ff:${IDENTIFIER}_short`]: {
        sound: "grass",
      },
    })
    await expandFile("RP/textures/terrain_texture.json", {
      texture_data: {
        [`${IDENTIFIER}_short`]: {
          textures: `textures/blocks/${IDENTIFIER}/${IDENTIFIER}_short`,
        },
      },
    });
    await expandFile("RP/textures/item_texture.json", {
      texture_data: {
        [`${IDENTIFIER}_short`]: {
          textures: `textures/blocks/${IDENTIFIER}/${IDENTIFIER}_short`,
        },
      },
    });
  }
  for (let count = TIER; count > 0; count--) {
    if(count === 1) {
      var type = `${IDENTIFIER}`
    };
    if(count === 2) {
      var type = `${IDENTIFIER}_tall`
    };
    if(count === 3) {
      var type = `${IDENTIFIER}_large`
    };
    if(count === 4) {
      var type = `${IDENTIFIER}_short`
    }
    var lootData = {
      "pools": [
        {
          "rolls": 1,
          "entries": [
            {
              "type": "item",
              "name": `ff:${type}_item`,
              "weight": 1,
              "functions": [
                {
                  "function": "set_count",
                  "count": {
                    "min": 1,
                    "max": 1
                  }
                }
              ]
            }
          ]
        }
      ]
    };
    var itemData = {
      format_version: "1.16.100",
      "minecraft:item": {
        description: {
          identifier: `ff:${type}_item`,
          category: "nature",
        },
        components: {
          "minecraft:block_placer": {
            block: `ff:${type}`,
            use_on: ["grass", "dirt", "podzol", "moss_block", "dirt_with_roots"],
          },
          "minecraft:icon": {
            texture: `${type}`,
          },
          "minecraft:creative_category": {
            parent: "itemGroup.name.flower",
          },
          "tag:flower": {},
          "minecraft:max_stack_size": 64,
          "minecraft:stacked_by_data": true,
          "minecraft:on_use_on": {
            on_use_on: {
              event: "sound",
            },
          },
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
    var featureData = {
      "format_version": "1.13.0",
      "minecraft:single_block_feature": {
        "description": {
          "identifier": `ff:${type}_feature`
        },
        "places_block": {
          "name": `ff:${type}`
        },
        "enforce_survivability_rules": true,
        "enforce_placement_rules": true
      }
    };
    await createFile(`BP/loot_tables/blocks/${IDENTIFIER}/${type}.json`, JSON.stringify(lootData));
    await createFile(`BP/items/${IDENTIFIER}/${type}.json`, JSON.stringify(itemData));
    await createFile(`BP/features/${type}_feature.json`, JSON.stringify(featureData));
  }
};
