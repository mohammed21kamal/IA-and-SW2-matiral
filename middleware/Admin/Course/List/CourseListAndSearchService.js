const util = require('util');
const conn = require('../../../../../db/dbConnection');

class CourseListAndSearchService {
    constructor() {
        this.conn = conn;
    }

    async listAndSearchCourses(search) {
        const query = util.promisify(this.conn.query).bind(this.conn);
        let whereClause = '';
        if (search) {
            whereClause = `WHERE id LIKE '%${search}%' OR code LIKE '%${search}%'`;
        }
        const courses = await query(`SELECT * FROM course ${whereClause}`);
        return courses;
    }
}

module.exports = CourseListAndSearchService;
