import sharp from 'sharp';
import multer from 'multer';
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

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      const error = new Error('Only images and videos are allowed!');
      error.status = 400;
      cb(error, false);
    }
  },
});

export {createThumbnail, upload};