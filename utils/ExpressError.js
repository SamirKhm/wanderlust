// utils/ExpressError.js
class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message); // pass message to the parent Error class
        this.statusCode = statusCode;
    }
}
module.exports = ExpressError;
