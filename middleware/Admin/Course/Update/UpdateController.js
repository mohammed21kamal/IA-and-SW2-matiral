
const { validationResult } = require("express-validator");
const CourseRepository = require("./CourseRepository");

module.exports = {
    async updateCourse(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const courseObj = {
                name: req.body.name,
                code: req.body.code,
                description: req.body.description,
            };
            await CourseRepository.updateCourse(req.params.id, courseObj);
            res.status(200).json({
                msg: "Course updated successfully",
            });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};