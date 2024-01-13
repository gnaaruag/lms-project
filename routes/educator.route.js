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
	serveModuleConfirmation, 
	requestPageCreation,
	createPage,
	servePageConfirmation,
	viewPage} = require('../controllers/educator.controller')

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
route.get('/add-page/:id', allMiddlewareChecks, requestPageCreation)
route.post('/add-page', allMiddlewareChecks, createPage)
route.get('/page-confirmation/:id', allMiddlewareChecks, servePageConfirmation)
route.get('/view-page/:id',allMiddlewareChecks, viewPage)


module.exports = route