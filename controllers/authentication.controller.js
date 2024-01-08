const { User } = require('../models')
const bcrypt = require('bcrypt')
const passport = require('passport')

const salt = 10

const requestStudentSignup = (request, response) => {
	response.render('signup-student')
}

const requestLogin = (request, response) => {
	response.render('login')
}

const requestEducatorSignup = (request, response) => {
	response.render('signup-educator')
}
const onboardUser = async (request, response) => {

	const { email, firstName, lastName, password, accessLevel } = request.body

	if (!email.trim() || !firstName.trim() || !lastName.trim() || password.length < 8) {
		request.flash('error', 'Invalid input. Please provide valid data.')
		return response.redirect(accessLevel === 'educator' ? '/signup-educator' : '/signup-student')
	}
	
	
	const existingUser = await User.findOne({ where: { email } })
	if (existingUser) {
		request.flash('error', 'Email already exists. Choose a different email address.')
		return response.redirect(accessLevel === 'educator' ? '/signup-educator' : '/signup-student')
	}

	const hashed = await bcrypt.hash(request.body.password, salt)
	try {
		const user = await User.create({
			firstName: request.body.firstName,
			lastName: request.body.lastName,
			email: request.body.email,
			password: hashed,
			accessLevel: request.body.accessLevel,
		})
		request.login(user, (err) => {
			if (err) {
				console.log(err)
			}
			response.redirect('/dashboard')
		})
	} catch (error) {
		console.log(error)
		request.flash('error', 'Couldnt create user. Try again!')
	}
}

// eslint-disable-next-line no-unused-vars
const createSession = (request, response, next) => {
	passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash: true,
	})(request, response, () => {
		// This function is called upon successful authentication
		request.flash('error', 'Username or password incorrect')
		response.redirect('/dashboard')
	})
}

const destroySession = (request, response, next) => {
	request.logOut((err) => {
		if (err) {
			return next(err)
		}
		response.redirect('/')
	})
}

const requestDashboard = async (request, response) => {

	const responseBody = {
		username: request.user.firstName,
		access: request.user.accessLevel,
	}

	if (request.user.accessLevel === 'educator') {
		response.render('dashboard-educator', { responseBody })
	}
	else {
		response.render('dashboard-student', { responseBody })
	}
}

module.exports = {
	requestStudentSignup,
	requestEducatorSignup,
	requestLogin,
	onboardUser,
	createSession,
	destroySession,
	requestDashboard,
}
