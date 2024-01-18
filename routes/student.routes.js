const express = require('express')
// eslint-disable-next-line no-unused-vars
const app = express()
const route = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const customMiddlewareCheck = require('../middleware/middleware')


// eslint-disable-next-line no-unused-vars
const allMiddlewareChecks = [connectEnsureLogin.ensureLoggedIn(), customMiddlewareCheck.checkStudent]

const { requestExplore, studentCourseOverview } = require('../controllers/student.controller')

route.get('/explore-courses',  requestExplore)
route.get('/course-preview/:id', allMiddlewareChecks, studentCourseOverview)
module.exports = route