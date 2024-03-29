const express = require('express')
// eslint-disable-next-line no-unused-vars
const app = express()
const route = express.Router()
const connectEnsureLogin = require('connect-ensure-login')


const {
	requestStudentSignup,
	requestEducatorSignup,
	requestLogin,
	onboardUser,
	createSession,
	destroySession,
	requestDashboard,
	getProfile,
	updatePassword
} = require('../controllers/authentication.controller')

route.get('/login', requestLogin)
route.get('/signup-student', requestStudentSignup)
route.get('/signup-educator', requestEducatorSignup)
route.post('/onboard', onboardUser)
route.post('/session-create', createSession)
route.get('/signout', destroySession)
route.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), requestDashboard)
route.get('/profile', connectEnsureLogin.ensureLoggedIn(), getProfile)
route.post('/update-password', connectEnsureLogin.ensureLoggedIn(), updatePassword)


module.exports = route
