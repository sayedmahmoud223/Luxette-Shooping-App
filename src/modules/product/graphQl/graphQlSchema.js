import {
    GraphQLSchema,
    GraphQLObjectType,
} from "graphql"
import {getProducts} from "./graphQl.fields.js"

export let productSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "getAllProducts",
        description: "",
        fields: {
            getProducts
        }
    })
})