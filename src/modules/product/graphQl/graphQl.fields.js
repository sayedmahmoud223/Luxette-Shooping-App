import {
    GraphQLList,
} from "graphql"
import { productModel } from "../../../../DB/model/Product.model.js"
import { productType } from "./graphQl.types.js"
export let getProducts = {
    type: new GraphQLList(productType),
    resolve: async () => {
        let products = await productModel.find({ isDeleted: false }).populate([
            {
                path:"categoryId",
                select:"name "
            }
        ])
        return products
    }

}