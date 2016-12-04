 const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLString,
} = require('graphql');

const { resolver, attributeFields, typeMapper } = require('graphql-sequelize');
const {
  Event,
  Image,
  Sequelize,
  Time,
  FormContactInfo,
  ContactInfo,
} = require('../models');

typeMapper.mapType((type) => {
  // map bools as strings
  if (type instanceof Sequelize.REAL) {
    return GraphQLFloat;
  }
  // use default for everything else
  return false;
});

const GraphQLTime = new GraphQLObjectType({
  name: 'Time',
  description: 'The start and end of the event',
  fields: attributeFields(Time),
});

const GraphQLContactInfo = new GraphQLObjectType({
  name: 'ContactInfo',
  description: 'the contact information for the event',
  fields: attributeFields(ContactInfo),
});

const GraphQLFormContactInfo = new GraphQLObjectType({
  name: 'FormContactInfo',
  description: 'the contact form information for the event',
  fields: attributeFields(FormContactInfo),
});

const GraphQLImage = new GraphQLObjectType({
  name: 'Image',
  description: 'an image',
  fields: attributeFields(Image),
});

const GraphQLEvent = new GraphQLObjectType({
  name: 'Event',
  description: 'an event',
  fields: Object.assign({}, attributeFields(Event), {
    times: {
      type: new GraphQLList(GraphQLTime),
      resolve: resolver(Event.Times),
    },
    image: {
      type: GraphQLImage,
      resolve: resolver(Event.Image),
    },
    contactInfo: {
      type: GraphQLContactInfo,
      resolve: resolver(Event.ContactInfo),
    },
    formContactInfo: {
      type: GraphQLFormContactInfo,
      resolve: resolver(Event.FormContactInfo),
    },
  }),
});

const Root = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    events: {
      type: new GraphQLList(GraphQLEvent),

      args: {
        // An arg with the key limit will automatically be converted to a limit on the target
        id: {
          type: GraphQLString,
        },
        limit: {
          type: GraphQLInt,
        },
        order: {
          type: GraphQLString,
        },
      },
      resolve: resolver(Event),
    },
  },
});

const schema = new GraphQLSchema({
  query: Root,
  // mutation: Mutation,
});

exports.schema = schema;
