const util = require('util');
const conn = require('../../../../../db/dbConnection');

class CourseService {
    constructor() {
        this.conn = conn;
    }

    async getCourse(courseId) {
        const query = util.promisify(this.conn.query).bind(this.conn);
        const courses = await query('SELECT * FROM course WHERE id = ?', [courseId]);
        return courses[0];
    }

    async deleteCourse(courseId) {
        const query = util.promisify(this.conn.query).bind(this.conn);
        await query('DELETE FROM course WHERE id = ?', [courseId]);
    }
}

module.exports = CourseService;
