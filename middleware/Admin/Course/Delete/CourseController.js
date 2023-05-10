const CourseService = require('../Delete/CourseService');

class CourseController {
    constructor() {
        this.courseService = new CourseService();
    }

    async deleteCourse(req, res) {
        try {
            const courseId = req.params.id;
            const course = await this.courseService.getCourse(courseId);

            if (!course) {
                return res.status(404).json({ msg: 'Course not found!' });
            }

            await this.courseService.deleteCourse(courseId);

            res.status(200).json({ msg: 'Course deleted successfully!' });
        } catch (err) {
            res.status(500).json(err);
        }

    }
}

module.exports = CourseController;