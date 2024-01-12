const express = require('express')
// eslint-disable-next-line no-unused-vars
const app = express()
const route = express.Router()
const connectEnsureLogin = require('connect-ensure-login')
const customMiddlewareCheck = require('../middleware/middleware')

const { requestCourseCreation, 
	createCourse, 
	serveCourseConfirmation, 
	requestChapterCreation, 
	createChapter, 
	serveChapterConfirmation, 
	viewCourse,
	requestModuleCreation,
	createModule,
	serveModuleConfirmation } = require('../controllers/educator.controller')

const allMiddlewareChecks = [connectEnsureLogin.ensureLoggedIn(), customMiddlewareCheck.checkEducator]

route.get('/create-course', allMiddlewareChecks, requestCourseCreation)
route.post('/create-course', allMiddlewareChecks, createCourse)
route.get('/course-confirmation/:id', allMiddlewareChecks, serveCourseConfirmation)
route.get('/add-chapter/:id', allMiddlewareChecks, requestChapterCreation)
route.post('/add-chapter', allMiddlewareChecks, createChapter)
route.get('/chapter-confirmation/:id', allMiddlewareChecks, serveChapterConfirmation)
route.get('/view-course/:id', allMiddlewareChecks, viewCourse)
route.get('/add-module/:id', allMiddlewareChecks, requestModuleCreation)
route.post('/add-module', allMiddlewareChecks, createModule)
route.get('/module-confirmation/:id', allMiddlewareChecks, serveModuleConfirmation)

module.exports = route