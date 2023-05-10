const express = require('express');
const CourseListAndSearchController = require('../List/CourseListAndSearchController');

class CourseListAndSearchRouter {
    constructor() {
        this.router = express.Router();
        this.courseListAndSearchController = new CourseListAndSearchController();
    }

    registerRoutes() {
        this.router.get('', this.courseListAndSearchController.listAndSearchCourses.bind(this.courseListAndSearchController));
        return this.router;
    }
}

module.exports = CourseListAndSearchRouter;
