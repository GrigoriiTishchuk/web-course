import api from './api/index.js';
import express from 'express';
import cors from 'cors';
import {notFoundHandler, errorHandler} from './middlewares/error-handlers.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use('/api/v1', api);

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.json({ok: true, data: req.body});
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);
export default app;