import sharp from 'sharp';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.file.path);
  // TODO: use file path to create 160x160 png thumbnail with sharp
  await sharp(req.file.path)
    .resize(160, 160)
    .toFormat('png')
    .toFile(`./uploads/thumb-${req.file.filename}.png`);
  console.log(`Thumbnail created for ${req.file.filename} in ${req.file.path}`);
  next();
};

export {createThumbnail};