const express = require('express')
// eslint-disable-next-line no-unused-vars
const app = express()
const route = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const customMiddlewareCheck = require('../middleware/middleware')

const { requestCourseCreation, createCourse } = require('../controllers/educator.controller')

const allMiddlewareChecks = [connectEnsureLogin.ensureLoggedIn(), customMiddlewareCheck.checkEducator]

route.get('/create-course', allMiddlewareChecks, requestCourseCreation)
route.post('/create-course', allMiddlewareChecks, createCourse)


module.exports = route