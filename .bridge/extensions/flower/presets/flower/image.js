module.exports = async ({ createFile, loadPresetFile, models }) => {
  let { IMAGE1, IMAGE2, IMAGE3, IMAGE4, IMAGE5, IMAGE6, IDENTIFIER } = models;

  await createFile(
    `RP/textures/blocks/${IDENTIFIER}/${IDENTIFIER}.png`,
    IMAGE1
  );
  if (IMAGE2) {
    await createFile(
      `RP/textures/blocks/${IDENTIFIER}/${IDENTIFIER}_tall.png`,
      IMAGE2
    );
  }
  if (IMAGE3) {
    await createFile(
      `RP/textures/blocks/${IDENTIFIER}/${IDENTIFIER}_large.png`,
      IMAGE3
    );
  }
  if (IMAGE4) {
    await createFile(
      `RP/textures/blocks/${IDENTIFIER}/${IDENTIFIER}_short.png`,
      IMAGE4
    );
  }
  if (IMAGE5) {
    await createFile(
      `RP/textures/items/${IDENTIFIER}/${IDENTIFIER}_tall.png`,
      IMAGE5
    );
  }
  if (IMAGE6) {
    await createFile(
      `RP/textures/items/${IDENTIFIER}/${IDENTIFIER}_large.png`,
      IMAGE6
    );
  }
};
