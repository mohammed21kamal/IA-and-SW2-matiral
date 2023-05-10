const router = require("express").Router();
const conn = require("../../db/dbConnection");
const admin = require("../../middleware/Tokens/admin");
const { body, validationResult } = require("express-validator");
const util = require("util");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const promisifiedQuery = util.promisify(conn.query).bind(conn);

router.post(
  "",
  admin,
  body("email").isEmail().withMessage("Please enter a valid email!"),

  body("name")
    .isString()
    .withMessage("Please enter a valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name should be between (3-20) characters"),

  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("Password should be between (8-12) characters"),

  body("phone")
    .isLength({ min: 10, max: 11 })
    .withMessage("Please enter a phone number"),

  async (req, res) => {
    try {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const emailExists = await promisifiedQuery(
        "SELECT * FROM users WHERE email = ?",
        [req.body.email]
      );
      if (emailExists.length > 0) {
        return res.status(400).json({
          errors: [{ msg: "Email already exists!" }],
        });
      }

      const student = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        roleId: 3,
        phone: req.body.phone,
        token: crypto.randomBytes(16).toString("hex"),
      };

      await promisifiedQuery("INSERT INTO users SET ?", student);

      res.status(200).json({
        msg: "Student created successfully!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);
    
    
    
// UPDATE STUDENT [ ADMIN ]
router.put(
    '/:id',
    admin,
    body('email').isEmail().withMessage('Please enter a valid email!'),
    body('name').isString().withMessage('Please enter a valid name').isLength({ min: 3, max: 20 }).withMessage('Name should be between 3-20 characters.'),
    body('password').isLength({ min: 8, max: 12 }).withMessage('Password should be between 8-12 characters.'),
    body('phone').isLength({ min: 10, max: 11 }).withMessage('Phone should be entered.'),
    body('status').isBoolean().withMessage('Please enter a valid status.').withMessage('Status should be active or inactive.'),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(conn.query).bind(conn);
            const students = await query('SELECT * FROM users WHERE roleId = ? AND id = ?', [3, req.params.id]);
            if (!students[0]) {
                return res.status(404).json({ msg: 'Student not found!' });
            }

            const studentObj = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                phone: req.body.phone,
                status: req.body.status,
                token: crypto.randomBytes(16).toString('hex'),
            };

            // 4. UPDATE STUDENT
            await query('UPDATE users SET ? WHERE id = ?', [studentObj, students[0].id]);
            res.status(200).json({ msg: 'Student updated successfully.' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
);
    
    
    
  // DELETE STUDENT [ ADMIN ]
router.delete("/:id", admin, async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
  
      const students = await query("SELECT * FROM users WHERE roleId = 3 AND id = ?", [req.params.id]);
  
      if (!students[0]) {
        res.status(404).json({ msg: "Student not found!" });
      }
  
      await query("DELETE FROM users WHERE id = ?", [students[0].id]);
  
      res.status(200).json({
        msg: "Student deleted successfully!",
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });
  
  // LIST STUDENT
  router.get("", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
  
    if (req.query.search) {
      search = `WHERE name LIKE '%${req.query.search}%' OR code LIKE '%${req.query.search}%'`;
    }
  
    const students = await query(`SELECT id, name, email, phone, status, roleId FROM users WHERE roleId = 3 ${search}`);
  
    res.status(200).json(students);
  });
  
  module.exports = router;