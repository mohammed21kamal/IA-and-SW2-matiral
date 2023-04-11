const router = require("express").Router();
const conn = require("../../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util");
const instructor = require("../../middleware/instructor");


router.put(
    "/grade/:id",
    instructor,
    body("grade")
      .isNumeric()
      .withMessage("Enter a volid grade"),
  
  
    async (req, res) => {
      const query = util.promisify(conn.query).bind(conn);
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
  
      try {
  
        // 1- CHECK IF student EXISTS OR NOT
        const student = await query("select * from users where roleId = 3 AND id = ?", [
          req.params.id,
        ]);
        if (!student[0]) {
          res.status(404).json({ msg: "student not found !" });
        }
  
  
        // 3- PREPARE ASSIGN OBJECT
        const gradelObj = {
          grade: req.body.grade,
        }
  
        // 4- INSERT INTO DB
        await query("update enrollment set ? where studentId = ? ", [
          gradelObj,
          student[0].id
        ]);   
        res.status(200).json({
          msg: "THE GRADE WAS UPDATE SUCCESSFULY :)"
        })
      } catch (err) {
        res.status(500).json(err);
        console.log(err)
      }
  
  
    });
  
module.exports = router;
