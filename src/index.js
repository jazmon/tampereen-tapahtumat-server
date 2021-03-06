import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import PrettyError from 'pretty-error';
import graphQLHTTP from 'express-graphql';

import {
  fetchEvents,
} from './fetchEvents';

import { schema } from '../data/schema';
import { Event, ContactInfo, Image, FormContactInfo, Time } from '../models';

// const schema = process.env.NODE_ENV === 'production'
//   ? require('../build-data/schema') // eslint-disable-line import/no-unresolved
//   : require('../data/schema');

const app = express();
const pe = new PrettyError();

app.use(morgan('combined'));
app.use(helmet());

app.use('/graphql', graphQLHTTP({ schema, pretty: true, graphiql: true }));

app.get('/', async (req, res) => {
  const events = await Event.findAll({
    attributes: [
      ['apiID', 'id'],
      'title',
      'description',
      'type',
      'latitude',
      'longitude',
      'free',
      'ticketLink',
    ],
    include: [{
      model: Image,
      as: 'image',
      attributes: ['title', 'uri'],
    }, {
      model: Time,
      as: 'times',
      attributes: ['start', 'end'],
    }, {
      model: ContactInfo,
      as: 'contactInfo',
      attributes: ['address', 'email', 'phone', 'link', 'companyName'],
    }, {
      model: FormContactInfo,
      as: 'formContactInfo',
      attributes: ['name', 'email', 'phone', 'jobTitle'],
    }],
  });
  return res.status(200).json(events);
});

app.get('/apiproxy', (req, res) => {
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
