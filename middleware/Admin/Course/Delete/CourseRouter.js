const CourseController = require('../Delete/CourseController');
const admin = require('../../../../Tokens/admin');

class CourseRouter {
    constructor(router) {
        this.router = router;
        this.courseController = new CourseController();
    }

    registerRoutes() {
        this.router.delete('/:id', admin, this.courseController.deleteCourse.bind(this.courseController));
    }
}

module.exports = CourseRouter;