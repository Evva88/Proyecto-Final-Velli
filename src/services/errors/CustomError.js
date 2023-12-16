export default class CustomError {
    static createError({statusCode = 500, name = "", cause, message, code = 1 }){
        const error = new Error(message, {cause});
        error.status = statusCode;
        error.name = name;
        error.code = code;
        throw error;
    };
};
