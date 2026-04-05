import express from 'express';
import multer from 'multer';
import {body} from 'express-validator';
import { createThumbnail } from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';
const upload = multer({dest: 'uploads/'});

import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

catRouter.route('/').get(getCat)
  .post(
    authenticateToken,
    upload.single('cat'), // file upload
    createThumbnail, // optional thumbnail creation
    body('cat_name').trim().isLength({min: 3, max: 50}),
    body('weight').isNumeric(),
    body('owner').isInt(),
    body('birthdate').isISO8601(),
    validationErrors, // handle validation errors
    postCat
  );

catRouter.route('/:id').get(getCatById)
.put(authenticateToken, putCat)
.delete(authenticateToken, deleteCat);

catRouter.get('/user/:id', getCatsByUserId);

export default catRouter;