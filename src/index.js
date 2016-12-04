import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import PrettyError from 'pretty-error';

import {
  fetchEvents,
} from './fetchEvents';

const app = express();
const pe = new PrettyError();

app.use(morgan('combined'));
app.use(helmet());

app.get('/', (req, res) => {
  fetchEvents()
    .then(events => res.json(events))
    .catch(err => res.status(500).send('error', JSON.stringify(err)));
});


//
// Error handlers
// ---------------------------
pe.skipNodeFiles();
pe.skipPackage('express');
pe.start();

// Catch 404 and throw it forward
app.use((req, res, next) => {
  const err = new Error('404 Not found');
  err.status = 404;
  next(err);
});

// Format and show errors
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (process.env.NODE_ENV === 'development' && !err.status === 404) {
    console.log(pe.render(err));
  }
  res.status(err.status || 500);
  res.send(app.get('env') === 'development'
  ? `${err.message}\n\n${err.stack}`
  : `${err.status} - Something broke!`);
});

export default app;
