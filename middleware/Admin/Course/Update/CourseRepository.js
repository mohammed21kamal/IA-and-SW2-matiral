const util = require("util");
const conn = require("../../../../../db/dbConnection");

module.exports = {
    async updateCourse(courseId, courseObj) {
        const query = util.promisify(conn.query).bind(conn);
        const courses = await query("SELECT * FROM course WHERE id = ?", [courseId]);
        if (!courses[0]) {
            throw new Error("Course not found!");
        }
        await query("UPDATE course SET ? WHERE id = ?", [courseObj, courses[0].id]);
    },
};
