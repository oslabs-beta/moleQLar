const { gql } = require('graphql-tag');

const typeDefs = gql`

    type User {
        userId: ID!,
        username: String!,
        email: String,
        password: String,
        role: Role,
        graphs: [Graph]
    }

    enum Role {
        USER
        ADMIN
    }

    type Graph {
        graphId: ID,
        userId: ID,
        graphName: String,
        nodes: String,
        edges: String,
    }

    type Query {
        user(userId: ID!): User!
        graph(graphId: ID!): Graph
        graphs: [Graph]
    }
`;

module.exports = typeDefs;