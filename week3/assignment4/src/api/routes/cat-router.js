import express from 'express';
import multer from 'multer';
import { createThumbnail } from '../../middlewares/upload.js';
const upload = multer({dest: 'uploads/'});

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

catRouter.route('/').get(getCat).post(upload.single('cat'), createThumbnail, postCat);

catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;