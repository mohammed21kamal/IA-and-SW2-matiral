const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); // helper


// LIST & SEARCH [ ADMIN, USER ]
router.get("", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if(req.query.search){
        search = `where studentId LIKE '%${req.query.search}%' or courseId LIKE '%${req.query.search}%'`;
    }
    const enrol = await query(`SELECT course.name, enrollment.grade FROM course JOIN enrollment ON course.id = enrollment.courseId; ${search}`);  
    res.status(200).json({
        enrol 
    }); 
});  
module.exports = router;      