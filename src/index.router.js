import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import cartRouter from './modules/cart/cart.router.js'
import categoryRouter from './modules/category/category.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import orderRouter from './modules/order/order.router.js'
import offerRouter from './modules/offer/offer.router.js'
import { productSchema } from './modules/product/graphQl/graphQlSchema.js'
import productRouter from './modules/product/product.router.js'
import userRouter from './modules/user/user.router.js'
import { graphqlHTTP } from "express-graphql"
// import rateLimit from "express-rate-limit"
import { asyncHandler, globalError } from './utils/errorHandling.js'
import { webhook } from './modules/order/controller/order.controller.js'

const initApp = (app, express) => {
    //convert Buffer Data
    app.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(webhook));
    app.use(express.json())
    //rate Limit
    // let rateLimiting = rateLimit({
    //     windowMs: 30 * 60 * 1000,
    //     max: 50,
    //     message: "too much requests",

    // })
    // app.use(rateLimiting)
    //graphQl Routing
    app.use("/graphql", graphqlHTTP({
        schema: productSchema,
        graphiql: true
    }))
    //Setup API Routing 
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/product`, productRouter)
    app.use(`/offer`, offerRouter)
    app.use(`/category`, categoryRouter)
    app.use(`/coupon`, couponRouter)
    app.use(`/cart`, cartRouter)
    app.use(`/order`, orderRouter)

    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    app.use(globalError)
    connectDB()

}



export default initApp