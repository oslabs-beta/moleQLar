// const {
//     buildSchema,
//     GraphQLObjectType,
//     GraphQLSchema,
//     GraphQLString,
//     GraphQLInt,
//     GraphQLList,
//     GraphQLNonNull,
//     GraphQLEnumType
// } = require('graphql');
// const { GraphQLID } = require('graphql/type/scalars');
// const db = require('../models/userModels'); // Assume you have a database module for data fetching



// const RootQueryType = new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
        
//     }
// });

// const RootMutationType = new GraphQLObjectType({
//     name: 'RootMutationType',
//     description: 'Root Mutation',
//     fields: () => ({
//       createUser: {
//         type: UserType,
//         description: 'Create a new user',
//         args: {
//             username: GraphQLNonNull(GraphQLString),
//             email: GraphQLString,
//             password: GraphQLString,
//             role: RoleType,
//         }
//       }  
//     })
// });

// module.exports = new GraphQLSchema({
//     query: RootQueryType,
//     mutation: RootMutationType
// })


const db = require('../models/userModels'); // Assume you have a database module for data fetching

const resolvers = {
    Query: {
        // access single user dependent on userId
        async user(_, { userId }) {
            const user = await db.queryUser(userId);
            return user;
        },
        // access single graph dependent on graphId
        async graph(_, { graphId }){
            const graph = await db.queryGraph(graphId)
            return graph;
        },
    },
    User: {
        // access subset of graphs that belong to the user
        async graphs(parent) {
            const graphs = await db.queryGraphs(parent.userId);
            return graphs;
        }
    }
};

module.exports = resolvers;