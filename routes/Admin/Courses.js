const router = require("express").Router();
const conn = require("../../db/dbConnection");
const admin = require("../../middleware/Tokens/admin");
const util = require("util");
const CourseValidator = require("../../middleware/SOLID/Admin/Course/Create/CourseValidator");
const CreateController = require("../../middleware/SOLID/Admin/Course/Create/CreateController");
const UpdateCourseValidation = require("../../middleware/SOLID/Admin/Course/Update/UpdateCourseValidation");
const UpdateController = require("../../middleware/SOLID/Admin/Course/Update/UpdateController");
const CourseRouter = require('../../middleware/SOLID/Admin/Course/Delete/CourseRouter');
const CourseListAndSearchRouter = require('../../middleware/SOLID/Admin/Course/List/CourseListAndSearchRouter');
const courseListAndSearchRouter = new CourseListAndSearchRouter();

// CREATE COURSE [ADMIN]
router.post(
  "",
  admin,
  CourseValidator.validateCreateCourse(),
  CourseValidator.checkValidationResult,
  CreateController.createCourse.bind(CreateController)
  ); 
  




// UPDATE COURSE [ADMIN]
router.put("/:id", admin, UpdateCourseValidation.validate(), UpdateController.updateCourse);






// Delete course [ADMIN]
const courseRouter = new CourseRouter(router);
courseRouter.registerRoutes();





// List and search [ADMIN, USER]
const rout = courseListAndSearchRouter.registerRoutes();
router.get("", rout);

  

module.exports = router;
  