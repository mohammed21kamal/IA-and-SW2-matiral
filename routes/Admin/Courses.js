const router = require("express").Router();
const conn = require("../../db/dbConnection");
const admin = require("../../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleware/uploadimages");
const util = require("util"); // helper
const fs = require("fs"); // file system




// CREATE COURSE [ ADMIN ]
router.post(
    "",
    admin,
    upload.single("image"),
    body("name")
        .isString()
        .withMessage("please enter a valid course name")
        .isLength({ min: 10 })
        .withMessage("course name should be at lease 10 characters"),


    body("code")
        .isString()
        .withMessage("please enter a valid course code")
        .isLength({ min: 5, max: 7 })
        .withMessage("course description should be between(5-7) characters"),

    body("description")
        .isString()
        .withMessage("please enter a valid course description")
        .isLength({ min: 20 })
        .withMessage("course description should be at lease 20 characters"),





    async (req, res) => {
        try {
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
                            msg: "Image is Required",
                        },
                    ],
                });
            }
            // 3- PREPARE COURSES OBJECT
            const course = {
                name: req.body.name,
                image: req.file.filename,
                code: req.body.code,
                description: req.body.description,
            };


            // 4 - INSERT COURSES INTO DB
            const query = util.promisify(conn.query).bind(conn);
            await query("insert into course set ? ", course);

            res.status(200).json({
                msg: "CREATE COURSE SUCCESSFULY :)",
            });

        } catch (err) {
            //console.log(err);
            res.status(500).json(err);
        }

    });



// UPDATE COURSE [ ADMIN ]
router.put(
    "/:id", // PARAMS
    admin,
    upload.single("image"),
    body("name")
        .isString()
        .withMessage("please enter a valid course name")
        .isLength({ min: 10 })
        .withMessage("course name should be at lease 10 characters"),


    body("code")
        .isString()
        .withMessage("please enter a valid course code")
        .isLength({ min: 5, max: 7 })
        .withMessage("course description should be between(5-7) characters"),

    body("description")
        .isString()
        .withMessage("please enter a valid course description")
        .isLength({ min: 20 })
        .withMessage("course description should be at lease 20 characters"),





    async (req, res) => {
        try {
            // 1- VALIDATION REQUEST [manual, express validation]
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }



            // 2- CHECK IF Course EXISTS OR NOT
            const courses = await query("select * from course where id = ?", [
                req.params.id,
            ]);
            if (!courses[0]) {
                res.status(404).json({ msg: "course not found !" });
            }


            // 3- PREPARE COURSES OBJECT
            const courseObj = {
                name: req.body.name,
                code: req.body.code,
                description: req.body.description,
            };
            if (req.file) {
                courseObj.image = req.file.filename;
                // delete old image
                fs.unlinkSync("./upload/" + courses[0].image);
            }


            // 4- UPDATE COURSES
            await query("update course set ? where id = ?", [
                courseObj,
                courses[0].id
            ]);

            res.status(200).json({
                msg: "UPDATE COURSE SUCCESSFULY :)",
            });

        } catch (err) {
            res.status(500).json(err);
        }

    });
 

// DELETE COURSE [ ADMIN ]
router.delete(
    "/:id", // PARAMS
    admin,
    async (req, res) => { 
        try {
            // 1- CHECK IF Course EXISTS OR NOT
            const query = util.promisify(conn.query).bind(conn);
            const courses = await query("select * from course where id = ?", [
                req.params.id,
            ]);
            if (!courses[0]) {
                res.status(404).json({ msg: "course not found !" });
            }

            // 2- REMOVE COURSE IMAGE
            fs.unlinkSync("./upload/" + courses[0].image);// delete old image
            await query("delete from course where id = ?", [courses[0].id]);
            res.status(200).json({
                msg: "DELETE COURSE SUCCESSFULY :)",
            }); 

        } catch (err) {
            res.status(500).json(err);
        }
    });


// LIST & SEARCH [ ADMIN, USER ]
router.get("", async (req, res) => {
        const query = util.promisify(conn.query).bind(conn);
        let search = "";
        if(req.query.search){
            search = `where id LIKE '%${req.query.search}%' or code LIKE '%${req.query.search}%'`;
        }
        const courses = await query(`select * from course ${search}`);
        res.status(200).json({
            courses
        });

    });




 



module.exports = router;