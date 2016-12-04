import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import {
  fetchEvents,
} from './fetchEvents';

const app = express();

app.use(morgan('combined'));
app.use(helmet());

app.get('/', (req, res) => {
  fetchEvents()
    .then(events => res.json(events))
    .catch(err => res.status(500).send('error', JSON.stringify(err)));
});

app.get('/test', (req, res) => {
  res.send('test');
});

export default app;
