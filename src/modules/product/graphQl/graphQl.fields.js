import {
    GraphQLID,
    GraphQLList,
} from "graphql"
import { productModel } from "../../../../DB/model/Product.model.js"
import { productType } from "./graphQl.types.js"
export let getProducts = {
    type: productType,
    args:{
        _id:{type: GraphQLID}
    } ,
    resolve: async (parent,args) => {
        let {_id} = args
        let products = await productModel.findOne({_id, isDeleted: false }).populate([
            {
                path:"category",
                select:"name "
            },
            {
                path:"variants",
            }
        ])
        return products
    }

}