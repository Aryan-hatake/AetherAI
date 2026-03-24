import { body, validationResult } from "express-validator";

const validate = async function (req, res,next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
           err.status = 401,
            next(err)

    }
    next()
}

export const registerValidator = [
    body("email")
        .isString().withMessage("string is required")
        .isEmail().withMessage("email is required")
        .notEmpty().withMessage("email is required"),
    body("password")
        .isAlphanumeric().withMessage("password should be combination of alphabets and characters")
        .isLength({ min: 6 }).withMessage("passoword length should be min 6 characters")
        .notEmpty().withMessage("Username is required"),
    body("username")
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
    validate
]
export const loginValidator = [
    body("email")
        .isString().withMessage("string is required")
        .isEmail().withMessage("email is required")
        .notEmpty().withMessage("email is required"),
    body("password")
        .isAlphanumeric().withMessage("password should be combination of alphabets and characters")
        .isLength({ min: 6 }).withMessage("passoword length should be min 6 characters")
        .notEmpty().withMessage("Username is required"),
    validate
]