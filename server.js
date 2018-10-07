const express = require('express');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql');
const cors = require('cors');

const port = process.env.PORT || 8080;

const app = express();

let COURSES = require('./data/courses');
let STUDENTS = require('./data/students');

const CourseType = new gql.GraphQLObjectType({
  name: 'CourseType',
  fields: {
    id: { type: gql.GraphQLID },
    name: { type: gql.GraphQLString },
    description: { type: gql.GraphQLString },
    level: { type: gql.GraphQLString }
  }
});

const StudentType = new gql.GraphQLObjectType({
  name: 'StudentType',
  fields: {
    id: { type: gql.GraphQLID },
    firstName: { type: gql.GraphQLString },
    lastName: { type: gql.GraphQLString },
    active: { type: gql.GraphQLBoolean },
    courses: { type: new gql.GraphQLList(CourseType) }
  }
});

const schema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      allCourses: {
        type: new gql.GraphQLList(CourseType),
        resolve() {
          return COURSES;
        }
      },
      allStudents: {
        type: new gql.GraphQLList(StudentType),
        resolve() {
          return STUDENTS;
        }
      }
    }
  }),
  mutation: new gql.GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      createCourse: {
        // Give the createCourse field a type
        type: CourseType,
        // Provide args for the createCourse field
        args: { 
          name: {type: new gql.GraphQLNonNull(gql.GraphQLString)},
          description: {type: new gql.GraphQLNonNull(gql.GraphQLString)},
          level: {type: new gql.GraphQLNonNull(gql.GraphQLString)}
         },
        resolve(_, { name, description, level }) {
          // Push the input onto the COURSES array
          const id = COURSES.length + 1;
          const newCourse = {
            id, name, description, level
          };
          COURSES.push(newCourse);
          // and return the input
          return newCourse;
        }
      },
      updateCourse: {
        // Give the updateCourse field a type
        // 
        type: CourseType,
        // TODO: Provide args for the updateCourse field
        args: {
          id: {type: gql.GraphQLString},
          name: {type: gql.GraphQLString},
          description: {type:gql.GraphQLString},
          level: {type: gql.GraphQLString}
         },
        resolve(_, { id, name, description, level }) {
          const input = { id, name, description, level };
          COURSES.map(course => {
            // If the course ID matches the mapped
            console.log(course.id === id);
            if (course.id === id) {
             // course, set it to the input
              course.name = input.name? input.name: course.name;
              course.description = input.description? input.description: course.description;
              course.level = input.level? input.level: course.level;
            }

          });
          console.log(COURSES);
          return input;
        }
      },
      deleteCourse: {
        // Give the deleteCourse field a type
        type:new gql.GraphQLList(CourseType),
        //  Provide args for the deleteCourse field
        args: { id: {type: new gql.GraphQLNonNull(gql.GraphQLString)} },
        resolve(_, { id }) {
          COURSES = COURSES.filter(course => course.id !== id)
          return COURSES
        }
      },
      createStudent: {
        // Give the createStudent field a type
        
        type: StudentType,
        // Provide args for the createStudent field
        args: {
          firstName: {type: new gql.GraphQLNonNull(gql.GraphQLString) },
          lastName: {type: new gql.GraphQLNonNull(gql.GraphQLString) },
          active: {type: new gql.GraphQLNonNull(gql.GraphQLBoolean) },
          courseIds: {type: new gql.GraphQLNonNull(new gql.GraphQLList(gql.GraphQLID))}
         },
        resolve(_, { firstName, lastName, active, courseIds }) {
          // Freebie!
          const id = STUDENTS.length + 1;
          const courses = [];
          courseIds.forEach(id => {
            courses.push(
              COURSES.find(course => {
                return course.id === id;
              })
            );
          });
          const input = {
            id,
            firstName,
            lastName,
            active,
            courses
          };
          STUDENTS.push(input);
          return input;
        }
      },
      updateStudent: {
        //Give the updateStudent field a type
        
        type: new gql.GraphQLList(StudentType),
        // Provide args for the updateStudent field
        args: { 
          id: {type: new gql.GraphQLNonNull(gql.GraphQLID) }, 
          firstName: {type: gql.GraphQLString}, 
          lastName: {type: gql.GraphQLString }, 
          active: {type: gql.GraphQLBoolean},
          coursesIds: {type: new gql.GraphQLList(gql.GraphQLID) } 
        },
        resolve(_, { id, firstName, lastName, active, coursesIds }) {
          // Freebie!
          let input = { id, firstName, lastName, active };
          console.log(input)
          input.courses = [];
          coursesIds && coursesIds.forEach(courseId => {
            input.courses.push(COURSES.find(course => course.id === courseId));
          });
          STUDENTS = STUDENTS.map(student => {
            if (student.id === id) {
              student = input;
            }
            return student;
          });
          return STUDENTS
        }
      },
      deleteStudent: {
        // Give the deleteStudent field a type
        type: new gql.GraphQLList(StudentType),
        // Provide args for the deleteStudent field
        args: { id: {type: new gql.GraphQLNonNull(gql.GraphQLString)} },
        resolve(_, { id }) {
          //find the student in the STUDENTS array by the id arg
          // and splice it out of the array.
          // If no student is found, return early
          STUDENTS = STUDENTS.filter(student => student.id !== id)
          return STUDENTS
        }
      }
    }
  })
});

app.use(
  '/graphql',
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(port);
console.log(`Server listening at localhost:${port}`);
