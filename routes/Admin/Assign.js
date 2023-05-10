const express = require("express");
const { body, validationResult } = require("express-validator");
const util = require("util");
const db = require("../../db/dbConnection");
const admin = require("../../middleware/Tokens/admin");
const router = express.Router();
const queryAsync = util.promisify(db.query).bind(db);

// Course service
class CourseService {
  async getCourseById(courseId) {
    const course = await queryAsync("SELECT * FROM course WHERE id = ?", [courseId]);
    return course.length ? course[0] : null;
  }
}

// Instructor service
class InstructorService {
  async getInstructorById(instructorId) {
    const instructor = await queryAsync("SELECT * FROM users WHERE roleId = 2 AND id = ?", [instructorId]);
    return instructor.length ? instructor[0] : null;
  }
}

// Course instructor service
class CourseInstructorService {
  async getCourseInstructorByInstructorAndCourse(instructorId, courseId) {
    const courseInstructor = await queryAsync("SELECT * FROM course_instructors WHERE instructorId = ? AND courseId = ?", [instructorId, courseId]);
    return courseInstructor.length ? courseInstructor[0] : null;
  }

  async createCourseInstructor(courseId, instructorId) {
    const courseInstructorObj = {
      instructorId,
      courseId,
    };

    await queryAsync("INSERT INTO course_instructors SET ?", courseInstructorObj);
  }
}

// Teaching controller
class TeachingController {
  constructor(courseService, instructorService, courseInstructorService) {
    this.courseService = courseService;
    this.instructorService = instructorService;
    this.courseInstructorService = courseInstructorService;
  }

  assignInstructorToCourse = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const courseId = req.body.courseId;
      const instructorId = req.body.instructorId;

      const course = await this.courseService.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ msg: "Course not found!" });
      }

      const courseInstructor = await this.courseInstructorService.getCourseInstructorByInstructorAndCourse(instructorId, courseId);
      if (courseInstructor) {
        return res.status(400).json({ msg: "Instructor is already teaching this course!" });
      }

      const instructor = await this.instructorService.getInstructorById(instructorId);
      if (!instructor) {
        return res.status(404).json({ msg: "Instructor not found!" });
      }

      await this.courseInstructorService.createCourseInstructor(courseId, instructorId);
      return res.status(200).json({ msg: "Assigned instructor to course successfully!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}

const courseService = new CourseService();
const instructorService = new InstructorService();
const courseInstructorService = new CourseInstructorService();

const teachingController = new TeachingController(courseService, instructorService, courseInstructorService);

router.post(
  "/teaching",
  admin,
  [
    body("courseId")
      .isNumeric()
      .withMessage("Please enter a valid course ID"),
    body("instructorId")
      .isNumeric()
      .withMessage("Please enter a valid instructor ID"),
  ],
  teachingController.assignInstructorToCourse
);
 
module.exports = router
