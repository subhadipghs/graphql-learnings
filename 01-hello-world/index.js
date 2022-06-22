import fs from "fs"
import util from "util"
import {authors, books} from "./seeds.js"
import {buildSchema, graphql} from "graphql"

var log = util.debuglog("app")
var err = util.debuglog("error")

var typeDef = fs
  .readFileSync("schema.graphql")
  .toString()

var schema = buildSchema(typeDef)

var rootValue = {
  book: function (args) {
    log("calling book resolver for %s", args.id)
    return books.filter(
      (book) => book.id === args.id
    )[0]
  },
  authors: function () {
    console.log("authors")
    return authors
  },
}

// var query = `
//   query GetBook($bookId: Int!) {
//     book(id: $bookId) {
//       id
//       name
//       isbn
//     }
//   }
// `

var source = `
  query GetAuthors {
    authors {
      id
      name
      books {
        name
      }
    }
  }
`

graphql({
  schema,
  rootValue,
  source,
})
  .then((res) => {
    log("%o", res)
  })
  .catch((e) => err(e))

process
  .on("uncaughtException", (e) => err(e))
  .on("unhandledRejection", (e) => err(e))
