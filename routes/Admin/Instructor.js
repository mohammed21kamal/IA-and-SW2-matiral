const express = require("express");
const router = express.Router();
const conn = require("../../db/dbConnection");
const admin = require("../../middleware/Tokens/admin");
const { body, validationResult } = require("express-validator");
const util = require("util");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const promisifiedQuery = util.promisify(conn.query).bind(conn);

// CREATE INSTRUCTOR [ADMIN]
router.post(
  "",
  admin,
  body("email").isEmail().withMessage("Please enter a valid email!"),
  body("name")
    .isString()
    .withMessage("Please enter a valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name should be between 3 and 20 characters"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("Password should be between 8 and 12 characters"),
  body("phone")
    .isLength({ min: 10, max: 11 })
    .withMessage("Phone number is required"),
  body("status")
    .isNumeric()
    .withMessage("Status should be active or inactive"),
    
  async (req, res) => {
    try {
      const errors = validationResult(req); // manual, express validation
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const checkEmailExists = await promisifiedQuery(
        "SELECT * FROM users WHERE email = ?",
        [req.body.email]
      ); 

      if (checkEmailExists.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "Email already exists!",
            },
          ],
        });
      }

      const instructor = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        roleId: 2,
        phone: req.body.phone,
        token: crypto.randomBytes(16).toString("hex"),
      }; 

      await promisifiedQuery("INSERT INTO users SET ?", instructor); // insert instructor into database

      res.status(200).json({
        msg: "Instructor created successfully :)",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

// UPDATE INSTRUCTOR [ ADMIN ]
router.put(
    "/:id",
    admin,
    [
      body("email").isEmail().withMessage("Please enter a valid email!"),
      body("name")
        .isString()
        .withMessage("Please enter a valid name")
        .isLength({ min: 3, max: 20 })
        .withMessage("Name should be between 3 and 20 characters"),
      body("password")
        .isLength({ min: 8, max: 12 })
        .withMessage("Password should be between 8 and 12 characters"),
      body("phone").isLength({ min: 10, max: 11 }).withMessage("Please enter a valid phone number"),
      body("status")
      .isNumeric()
      .withMessage("Status should be active or inactive")
   ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const instructor = await promisifiedQuery("SELECT * FROM users WHERE roleId = 2 AND id = ?", [req.params.id]);
        if (!instructor[0]) {
          return res.status(404).json({ msg: "Instructor not found" });
        }
  
        const instructorObj = {
          name: req.body.name,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),
          phone: req.body.phone,
          token: crypto.randomBytes(16).toString("hex"),
          status: req.body.status,
        };
  
        await promisifiedQuery("UPDATE users SET ? WHERE id = ?", [instructorObj, instructor[0].id]);
  
        res.status(200).json({ msg: "Update instructor successfully" });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  );
  


// DELETE INSTRUCTOR [ ADMIN ]
router.delete("/:id", admin, async (req, res) => {
    try {

      const instructors = await promisifiedQuery("SELECT * FROM users WHERE roleId = 2 AND id = ?", [
        req.params.id,
      ]);
  
      if (!instructors[0]) {
        return res.status(404).json({ msg: "Instructor not found!" });
      }
  
      await promisifiedQuery("DELETE FROM users WHERE id = ?", [instructors[0].id]);
  
      res.status(200).json({
        msg: "Instructor deleted successfully.",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });


// LIST INSTRUCTOR 
router.get("", async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      let search = "";
      if (req.query.search) {
        search = `where name LIKE '%${req.query.search}%' or code LIKE '%${req.query.search}%'`;
      }
      const instructors = await query(`select id, name, email, phone, status, roleId from users where roleId = 2 ${search}`);
      res.status(200).json(instructors);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });


module.exports = router;  

   