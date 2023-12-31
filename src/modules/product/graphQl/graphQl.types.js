
import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean
} from "graphql"

export let productType = new GraphQLObjectType({
    name: "getProducts",
    description: "getProductsWithGeaphQl",
    fields: {
        ProductName: { type: GraphQLString },
        description: { type: GraphQLString },
        // size: { type: new GraphQLList(GraphQLString) },
        subImages: {
            type: new GraphQLList(new GraphQLObjectType({
                name: "images",
                description: "subImages",
                fields: {
                    public_id: { type: GraphQLString },
                    secure_url: { type: GraphQLString },
                }
            }))
        },
        variants: {
            type: new GraphQLList(new GraphQLObjectType({
                name: "variants",
                description: "descripeProduct",
                fields: {
                    colorName: { type: GraphQLString },
                    size: { type: GraphQLString },
                    stock: { type: GraphQLInt },
                    subImages: {
                        type: new GraphQLList(new GraphQLObjectType({
                            name: "VariantImages",
                            description: "subImages",
                            fields: {
                                public_id: { type: GraphQLString },
                                secure_url: { type: GraphQLString },
                            }
                        }))
                    },
                }
            }))
        },
        mainImage: {
            type: new GraphQLObjectType({
                name: "image",
                description: "mainImage",
                fields: {
                    public_id: { type: GraphQLString },
                    secure_url: { type: GraphQLString },
                }
            })
        },
        colors: { type: new GraphQLList(GraphQLString) },
        sizes: { type: new GraphQLList(GraphQLString) },
        stock: { type: GraphQLInt },
        price: { type: GraphQLInt },
        category:{type: new GraphQLObjectType({
            name:"categoryDetails",
            fields:{
                name:{type: GraphQLString}
            }
        })},
        isDeleted: { type: GraphQLBoolean },

    }
})