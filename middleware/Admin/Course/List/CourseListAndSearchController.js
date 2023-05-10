const CourseListAndSearchService = require('../List/CourseListAndSearchService');

class CourseListAndSearchController {
    constructor() {
        this.courseListAndSearchService = new CourseListAndSearchService();
    }

    async listAndSearchCourses(req, res) {
        try {
            const courses = await this.courseListAndSearchService.listAndSearchCourses(req.query.search);
            res.status(200).json(courses);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = CourseListAndSearchController