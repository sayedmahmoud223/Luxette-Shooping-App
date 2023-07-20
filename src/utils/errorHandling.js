export class ResError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
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
        if (process.env.MOOD === "DEV") {
            return res.status(err.statusCode || 500).json({ message: err.message, stack: err.stack })
        }
        return res.status(err.statusCode).json({ message: err.message })
    }
}