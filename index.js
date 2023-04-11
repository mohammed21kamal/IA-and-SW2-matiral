// =============== INITALIZE EXPRESS APP =============== //
const express = require("express");
const app = express();

// =============== GLOBAL MIDDLEWARE =============== //
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // TO ACCESS URL FORM ENCODED
app.use(express.static('upload'));
const cors = require("cors");
app.use(cors()); // ALLOW HTTP REQUESTS LOCAL HOSTS

// =============== REQUIRED MODULES =============== //


const auth = require("./routes/Auth");
const courses = require("./routes/Admin/Courses");
const instructor = require("./routes/Admin/Instructor");
const assign = require("./routes/Admin/Assign");
const enrollment = require("./routes/Student/Enrollment");
const grade = require("./routes/Instructor/grade");
const showGrade = require("./routes/Student/ShowGrade");
const lesson = require("./routes/Instructor/lesson");

// =============== RUN THE APP =============== //
app.listen(4000, "localhost", () => {
    console.log("SERVER IS RUNNING ")
});

// =============== API ROUTES [ ENDPOINTS ] =========== ==== //
app.use("/auth", auth);
app.use("/courses", courses);
app.use("/instructor", instructor);
app.use("/assign", assign);
app.use("/enroll", enrollment);
app.use("/grade", grade);
app.use("/showGrade", showGrade);
app.use("/lesson", lesson);
