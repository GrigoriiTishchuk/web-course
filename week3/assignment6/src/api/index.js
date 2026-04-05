import catRouter from './routes/cat-router.js';
import express from 'express';
import userRouter from './routes/user-router.js';
import authRouter from './routes/auth-router.js';

const router = express.Router();

// bind base url for all cat routes to catRouter and userRouter and authRouter
router.use('/cats', catRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;