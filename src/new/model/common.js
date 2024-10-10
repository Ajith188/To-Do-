const { body } = require("express-validator")

const validation = [body("email").isEmail().withMessage("email must be valied"),
    body("user_name")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
    .isAlphanumeric().withMessage("Username must contain only letters and numbers"),
body("password").isLength({ min: "5", max: "20" }).withMessage("Atleast must be 5 character")
]

const login_validation=[
    body("email").isEmail().withMessage("email must be valied"),
    body("password")
        .notEmpty().withMessage("password is required")
]


const To_Do_validation = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
        body("completed")
        .notEmpty().withMessage("completed is required")
        .isBoolean().withMessage("completed must be true or false"),
];


module.exports = {
    validation,
    To_Do_validation,
    login_validation
}