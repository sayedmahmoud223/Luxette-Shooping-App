export class ResError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}


export let asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            return next(err)
        })
    }
}


export let globalError = (err, req, res, next) => {
    if (err) {
        let message = err.message;
        let statusCode = err.status || 500;
        if (process.env.MOOD == "dev") {
            return res.status(statusCode).json({ "message": message, stack: err.stack })
        }
        return res.status(statusCode).json({ "message": message })
    }
}