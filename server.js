const express = require('express');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql');

const port = process.env.PORT || 8080;

const app = express();

const messageAsString = 'Hello, world!';
const messageAsObject = { message: 'Hello, world!' };

const schema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'Root',
    fields: {
      // if we want to get our message
      // just as a string
      message: {
        // TODO: tell GraphQL that the message field should be a string type
        // and that it should resolve with the messageAsString string
        type: gql.GraphQLString,
        resolve() {
          return messageAsString
        }
      },
      // if we want to get our message
      // as a key on an objet. note that
      // we can work with multiple keys in
      // this case if we want
      messageAsObject: {
        // TODO: tell GraphQL that the messageAsObject field should be an Object type
        // and that it should resolve with the messageAsObject object
        type: new gql.GraphQLObjectType({
          name: 'messageAsObject',
          fields: {
            message: {
              type: new gql.GraphQLNonNull(GraphQLString)
            }
          }
        }),
        resolve() { return messageAsObject }

      }
    }
  })
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(port);
console.log(`Server listening at localhost:${port}`);
