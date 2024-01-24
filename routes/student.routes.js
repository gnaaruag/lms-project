const express = require('express')
// eslint-disable-next-line no-unused-vars
const app = express()
const route = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const customMiddlewareCheck = require('../middleware/middleware')


// eslint-disable-next-line no-unused-vars
const allMiddlewareChecks = [connectEnsureLogin.ensureLoggedIn(), customMiddlewareCheck.checkStudent]

const { requestExplore, studentCourseOverview, enrollStudentToCourse, courseEntryPoint, chapterOverview } = require('../controllers/student.controller')

route.get('/explore-courses',  requestExplore)
route.get('/course-preview/:id', allMiddlewareChecks, studentCourseOverview)
route.get('/enroll/:id', allMiddlewareChecks, enrollStudentToCourse)
route.get('/course-outline/:id', allMiddlewareChecks, courseEntryPoint)
route.get('/chapter-overview/:id', allMiddlewareChecks, chapterOverview)
module.exports = route