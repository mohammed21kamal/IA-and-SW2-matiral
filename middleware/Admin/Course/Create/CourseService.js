const conn = require("../../../../../db/dbConnection");
const util = require("util");

class CourseService {
    async createCourse(course) {
        const query = util.promisify(conn.query).bind(conn);
        await query("insert into course set ?", course);
    }
}

module.exports = CourseService;