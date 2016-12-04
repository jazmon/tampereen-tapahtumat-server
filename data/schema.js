import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLString,
} from 'graphql';

import { resolver, attributeFields, typeMapper } from 'graphql-sequelize';
import { Event, Image, Sequelize } from '../models';

typeMapper.mapType((type) => {
  // map bools as strings
  if (type instanceof Sequelize.REAL) {
    return GraphQLFloat;
  }
  // use default for everything else
  return false;
});

export const GraphQLEvent = new GraphQLObjectType({
  name: 'Event',
  description: 'an event',
  fields: {
    // id: {
    //   type: new GraphQLNonNull(GraphQLString),
    //   description: 'The id of the task.',
    // },
    title: {
      type: GraphQLString,
      description: 'The title of the event.',
    },
  },
  // fields: attributeFields(Event),
});

// const GraphQLImage = new GraphQLObjectType({
//   name: 'Image',
//   description: 'an image',
//   fields: attributeFields(Image),
// });

export const Root = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    events: {
      type: new GraphQLList(GraphQLEvent),
      resolve: resolver(Event),
    },
  },
});

export const schema = new GraphQLSchema({
  query: Root,
  // mutation: Mutation,
});

export default schema;
