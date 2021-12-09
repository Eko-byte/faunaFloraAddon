module.exports = async ({ createFile, models }) => {
  const {
    IDENTIFIER,
    RARITY,
    BIOMES,
    CLUSTER,
    FLOWERS,
    PATCH_SIZE,
    PATCH_SCATTER_CHANCE,
  } = models;

  var type = IDENTIFIER;
  var biomes = [BIOMES]; //biome, biome
  var rarity = RARITY;

  if (CLUSTER) {
    var feature = `ff:${IDENTIFIER}/${IDENTIFIER}_snap_to_surface_feature`;
  }
  if (!CLUSTER) {
    var feature = `ff:${IDENTIFIER}/${IDENTIFIER}_feature`;
  }
  if (CLUSTER) {
    var patchSize = PATCH_SIZE;
    var patchScatterChance = PATCH_SCATTER_CHANCE;
    var patchData = {
      format_version: "1.13.0",
      "minecraft:weighted_random_feature": {
        description: {
          identifier: `ff:${IDENTIFIER}/${IDENTIFIER}_flower_feature`,
        },
        features: [FLOWERS],
      },
    };
    var snapData = {
      format_version: "1.16.0",

      "minecraft:snap_to_surface_feature": {
        description: {
          identifier: `ff:${IDENTIFIER}/${IDENTIFIER}_snap_to_surface_feature`,
        },

        feature_to_snap: `ff:${IDENTIFIER}/${IDENTIFIER}_cluster_feature`,

        surface: "floor",
        vertical_search_range: 12,
      },
    };
    await createFile(
      `BP/features/${IDENTIFIER}/${IDENTIFIER}_snap_to_surface_feature.json`,
      JSON.stringify(patchData)
    );
    await createFile(
      `BP/features/${IDENTIFIER}/${IDENTIFIER}_flower_feature.json`,
      JSON.stringify(patchData)
    );
    var scatterData = {
      format_version: "1.13.0",
      "minecraft:scatter_feature": {
        description: {
          identifier: `ff:${IDENTIFIER}/${IDENTIFIER}_cluster_feature`,
        },
        places_feature: `ff:${IDENTIFIER}/${IDENTIFIER}_flower_feature`,
        iterations: patchSize,
        scatter_chance: patchScatterChance,
        x: {
          distribution: "uniform",
          extent: [-5, 5],
        },
        y: 0,
        z: {
          distribution: "uniform",
          extent: [-5, 5],
        },
      },
    };

    await createFile(
      `BP/features/${IDENTIFIER}/${IDENTIFIER}_cluster_feature.json`,
      JSON.stringify(scatterData)
    );
  }

  function createRule(type, biomes, rarity, feature) {
    let path = [];
    let rule = {
      format_version: "1.13.0",
      "minecraft:feature_rules": {
        description: {
          identifier: `ff:${type}_feature_rule`,
          places_feature: feature,
        },
        conditions: {
          placement_pass: "surface_pass",
          "minecraft:biome_filter": [
            {
              any_of: path,
            },
          ],
        },
        distribution: {
          iterations: rarity,
          scatter_chance: {
            numerator: 1,
            denominator: 5,
          },
          x: {
            distribution: "uniform",
            extent: [-8, 8],
          },
          y: "query.heightmap(variable.worldx, variable.worldz)",
          z: {
            distribution: "uniform",
            extent: [-8, 8],
          },
        },
      },
    };
    biomes.forEach((v) => path.push(biomeFilter(v)));
    return rule;
  }

  function biomeFilter(biome) {
    return {
      test: "has_biome_tag",
      operator: "==",
      value: biome,
    };
  }

  await createFile(
    `BP/feature_rules/${IDENTIFIER}/${IDENTIFIER}_feature_rule.json`,
    JSON.stringify(createRule(type, biomes, rarity, feature))
  );
};
