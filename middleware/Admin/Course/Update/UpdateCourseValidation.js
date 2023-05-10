const { body } = require("express-validator");

module.exports = {
    validate() {
        return [
            body("name")
                .isString()
                .withMessage("Please enter a valid course name")
                .isLength({ min: 10 })
                .withMessage("Course name should be at least 10 characters long"),
            body("code")
                .isString()
                .withMessage("Please enter a valid course code")
                .isLength({ min: 5, max: 7 })
                .withMessage("Course code should be between 5-7 characters long"),
            body("description")
                .isString()
                .withMessage("Please enter a valid course description")
                .isLength({ min: 20 })
                .withMessage("Course description should be at least 20 characters long"),
        ];
    },
};