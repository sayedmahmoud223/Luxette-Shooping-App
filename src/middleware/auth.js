import jwt from "jsonwebtoken";
import { ResError, asyncHandler } from "../utils/errorHandling.js"
import userModel from "../../DB/model/User.model.js";


const auth = (AccessRoles = []) => {
    return asyncHandler(
        async (req, res, next) => {
            const { authorization } = req.headers;
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                return next(new ResError("In-valid bearer key", 400))
            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
            if (!token) {
                return next(new ResError("In-valid token", 400))
            }
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
            if (!decoded?.id) {
                return next(new ResError("In-valid token payload", 400))
            }
            const authUser = await userModel.findById(decoded.id).select('userName email role')
            if (!authUser) {
                return next(new ResError("Not register account", 400))
            }
            if (!AccessRoles.includes(authUser.role)) {
                return next(new ResError("not authrization", 400))
            }
            req.user = authUser;
            return next()
        }

    )
}
export default auth