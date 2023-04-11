const router = require("express").Router();
const conn = require("../../db/dbConnection");
const admin = require("../../middleware/admin");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper
const crypto = require("crypto");
const bcrypt = require("bcrypt");




// CREATE INSTRUCTOR [ ADMIN ]
router.post(
    "",
    admin,
    body("email")
        .isEmail()
        .withMessage("please enter a valid email!"),


    body("name")
        .isString()
        .withMessage("please enter a valid name")
        .isLength({ min: 3, max: 20 })
        .withMessage("name should be between (3-20) character"),


    body("password")
        .isLength({ min: 8, max: 12 })
        .withMessage("password should be between (8-12) character"),


    body("phone")
        .isLength({ min: 10, max: 11 })
        .withMessage("Phone should be enter"),

    async (req, res) => {
        try {
            // 1- VALIDATION REQUEST [manual, express validation]
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // 2- CHECK IF EMAIL EXISTS
            const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
            const checkEmailExists = await query(
                "select * from users where email = ?",
                [req.body.email]
            );
            if (checkEmailExists.length > 0) {
                res.status(400).json({
                    errors: [
                        {
                            msg: "email already exists !",
                        },
                    ],
                });
            } 

            // 3- PREPARE COURSES OBJECT
            const instructors = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                roleId: 2,
                phone: req.body.phone,
                token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
            };


            // 4 - INSERT COURSES INTO DB
            await query("insert into users set ? ", instructors);

            res.status(200).json({
                msg: "CREATE INSTRUCTOR SUCCESSFULY :)",
            });

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }

    });



// UPDATE COURSE [ ADMIN ]
router.put(
    "/:id", // PARAMS
    admin,
    body("email")
        .isEmail()
        .withMessage("please enter a valid email!"),


    body("name")
        .isString()
        .withMessage("please enter a valid name")
        .isLength({ min: 3, max: 20 })
        .withMessage("name should be between (3-20) character"),


    body("password")
        .isLength({ min: 8, max: 12 })
        .withMessage("password should be between (8-12) character"),


    body("phone")
        .isLength({ min: 10, max: 11 })
        .withMessage("Phone should be enter"),





    async (req, res) => {
        try {
            // 1- VALIDATION REQUEST [manual, express validation]
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }



            // 2- CHECK IF Course EXISTS OR NOT
            const instractors = await query("select * from users where roleId = 2 and id = ?", [
                req.params.id,
            ]);
            if (!instractors[0]) {
                res.status(404).json({ msg: "instructor not found !" });
            } 


            // 3- PREPARE COURSES OBJECT
            const instractorObj = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10), 
                phone: req.body.phone,
                token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
            };


            // 4- UPDATE COURSES
            await query("update users set ? where id = ?", [
                instractorObj,
                instractors[0].id
            ]);

            res.status(200).json({
                msg: "UPDATE INSTRUCTOR SUCCESSFULY :)",
            });

        } catch (err) {
            res.status(500).json(err);
            console.log(err);
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
            const instructors = await query("select * from users where roleId = 2 and id = ?", [
                req.params.id,
            ]);
            if (!instructors[0]) {
                res.status(404).json({ msg: "instructor not found !" });
            }

            // 2- REMOVE COURSE IMAGE
            await query("delete from users where id = ?", [instructors[0].id]);
            res.status(200).json({
                msg: "DELETE COURSE SUCCESSFULY :)",
            });

        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });



module.exports = router;  