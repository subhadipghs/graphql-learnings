// @ts-check
import fs from "node:fs"
import {buildSchema} from "graphql"
import {ApolloServer, gql} from "apollo-server"
import {authors, books} from "./seeds.js"

var typeDefs = fs
  .readFileSync("schema.graphql")
  .toString()

var schema = buildSchema(typeDefs)

var resolvers = {
  Query: {
    authors() {
      return authors
    },
    book(_parent, args) {
      var book = books.filter((b) => b.id == args.id)
      return book.length > 0 ? book[0] : null
    },
  },
}

var server = new ApolloServer({
  typeDefs: gql`
    type Book {
      id: Int!
      name: String!
    }

    type Author {
      id: Int!
      name: String!
      books: [Book]
    }

    type Query {
      authors: [Author]
      book(id: Int!): Book
    }
  `,
  resolvers,
})

const port = process.env.PORT || 2345

server.listen(port).then(function () {
  console.log("🚀 Apollo server is running")
})
