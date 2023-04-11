const router = require("express").Router();
const conn = require("../../db/dbConnection");
const instructor = require("../../middleware/instructor");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleware/uploadimages");
const util = require("util"); // helper
const fs = require("fs"); // file system


// CREATE LESSON [ instructor ]
router.post(
    "",
    instructor,
    upload.single("video"),
    body("title")
        .isString()
        .withMessage("please enter a valid title of lesson")
        .isLength({ min: 1 })
        .withMessage("course name should be at lease 1 characters"),

    body("courseId")
        .isNumeric()
        .withMessage("Please enter a valid course ID"),

 
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            // 1- VALIDATION REQUEST [manual, express validation]
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 2- VALIDATE THE IMAGE
            if (!req.file) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "video is Required",
                        },
                    ],
                });
            }
            // 3- CHECK IF lesson EXISTS OR NOT
            const courses = await query("select * from course where id = ?", [
                req.body.courseId,
            ]);
            if (!courses[0]) {
                res.status(404).json({ msg: "course not found !" });
            }

            // 4- PREPARE lesson OBJECT
            const lesson = {
                title: req.body.title,
                contant: req.file.filename,
                courseId: req.body.courseId,
            };


            // 4 - INSERT lession INTO DB
            await query("insert into lession set ? ", lesson);

            res.status(200).json({
                msg: "CREATE LESSON SUCCESSFULY :)",
            });

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }

    });

// UPDATE COURSE [ instructor ]
router.put(
    "/:id",
    instructor,
    upload.single("content"),
    body("title")
        .isString()
        .withMessage("please enter a valid title of lesson")
        .isLength({ min: 1 })
        .withMessage("course name should be at lease 1 characters"),

    body("courseId")
        .isNumeric()
        .withMessage("Please enter a valid course ID"),

    async (req, res) => {
        try {
            // 1- VALIDATION REQUEST [manual, express validation]
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 2- CHECK IF lesson EXISTS OR NOT
            const lessons = await query("SELECT * FROM lession WHERE id = ?", [
                req.params.id,
            ]);
            if (!lessons[0]) {
                return res.status(404).json({ msg: "Lesson not found!" });
            }

            // 3- PREPARE lesson OBJECT
            const lessonObj = {
                title: req.body.title,
                courseId: req.body.courseId,
            };
            if (req.file) {
                lessonObj.contant = req.file.filename;
                // delete old video
                const oldVideoPath = './upload/videos/' + lessons[0].contant;
                if (fs.existsSync(oldVideoPath)) {
                    fs.unlinkSync(oldVideoPath);
                }
            }
                        
            // 4- UPDATE LESSON
            await query("UPDATE lession SET ? WHERE id = ?", [
                lessonObj,
                lessons[0].id
            ]);

            res.status(200).json({
                msg: "Lesson updated successfully :)",
            });

        } catch (err) {
            res.status(500).json(err);
            console.log(err)
        }
    }
);

// DELETE COURSE [ instructor ]

router.delete("/:id", instructor, async (req, res) => {
    try {
      // 1- FIND LESSON
      const query = util.promisify(conn.query).bind(conn);
      const lessons = await query("SELECT * FROM lession WHERE id = ?", [
        req.params.id,
      ]);
  
      if (!lessons[0]) {
        return res.status(404).json({ msg: "Lesson not found!" });
      }
  
      // 2- DELETE VIDEO
      const oldVideoPath = "./upload/videos/" + lessons[0].content;
      if (fs.existsSync(oldVideoPath)) {
        fs.unlinkSync(oldVideoPath);
      }
  
      // 3- DELETE LESSON
      await query("DELETE FROM lession WHERE id = ?", [req.params.id]);
  
      res.status(200).json({
        msg: "Lesson deleted successfully :)",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server Error!" });
    }
  });
  
  module.exports = router;
  


module.exports = router;
