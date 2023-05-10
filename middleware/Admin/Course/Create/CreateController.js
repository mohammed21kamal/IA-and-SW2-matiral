const CourseService = require("./CourseService");
const CourseValidator = require("./CourseValidator");

class CourseController {
    constructor() {
        this.courseService = new CourseService();
    }

    async createCourse(req, res) {
        try {
            const course = {
                name: req.body.name,
                code: req.body.code,
                description: req.body.description,
            };
            await this.courseService.createCourse(course);

            res.status(200).json({
                msg: "Course created successfully",
            });
        } catch (err) { 
            console.error(err);
            res.status(500).json(err);
        }

    }
}

module.exports = new CourseController();
