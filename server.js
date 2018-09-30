const express = require('express');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql');
const cors = require('cors');

const port = process.env.PORT || 8080;

const app = express();

const COURSES = require('./data/courses');
const STUDENTS = require('./data/students');

// TODO: Create a GraphQLObjectType which holds fields
// that describes the data in the data/courses.js file
const CourseType = new gql.GraphQLObjectType({
  name: 'course',
  fields: {
    id: {
      type: gql.GraphQLID      
    },
    name: {type: gql.GraphQLString},
    description: {type: gql.GraphQLString},
    level: {type: gql.GraphQLString}
  }
}) // ...

// TODO: Create a GraphQLObjectType which holds fields
// that describes the data in the data/students.js file

// NOTE: think carefully about how to model the `courses` field
const StudentType = new gql.GraphQLObjectType({
  name: 'student',
  fields: {
    id: {type: gql.GraphQLID},
    firstName: {type: gql.GraphQLString},
    lastName: {type: gql.GraphQLString},
    active: {type: gql.GraphQLBoolean},
    courses: {type: new gql.GraphQLList(CourseType)}
  }
})

// TODO: Create a GraphQLSchema which holds
// a root query type. The root query type should
// have fields used to get a list of all the courses
// and all the students. Use the `resolve` function
// to return the data when it is queried
const schema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'Root',
    fields: {
      allCourses: {type: new gql.GraphQLList(CourseType), resolve() {return COURSES}},
      allStudents: {type: new gql.GraphQLList(StudentType), resolve() {return STUDENTS}}
    }
  })
})


app.use(
  '/graphql',
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(port);
console.log(`Server listening on localhost:${port}`);
