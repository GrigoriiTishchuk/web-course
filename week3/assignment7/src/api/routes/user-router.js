import express from 'express';
import {body} from 'express-validator';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';
const userRouter = express.Router();

userRouter.route('/').get(getUser)
  .post(
    body('email').trim().isEmail().withMessage('email must be a valid email'),
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 8}).withMessage('password must be at least 8 characters'),
    validationErrors,
    postUser
  );

userRouter.route('/:id')
.get(getUserById)
.put(authenticateToken, putUser)
.delete(authenticateToken, deleteUser);

export default userRouter;