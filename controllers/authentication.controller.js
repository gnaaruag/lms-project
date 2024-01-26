const { User, Course, Enrollment } = require('../models')
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
		failureFlash: 'Invalid Username or Password',
	})(request, response, () => {
		// only afte succesful login
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
		try {
			const returnCourses = await Course.findAll({
				where: { userId: request.user.id }
			})
			response.render('dashboard-educator', { responseBody, returnCourses })

		} catch (err) {
			request.flash('error', 'There was some error in fetching your courses')
			console.log(err)
		}
	}
	else {
		try {
			const enrolledCourses = await Enrollment.findAll({
				where: {
					userId: request.user.id,
				},
			})

			const userCourses = await Promise.all(
				enrolledCourses.map(async (element) => {
					const course = await Course.findOne({ where: { id: element.courseId } })
					const instructor = await User.findOne({ where: { id: course.userId } })
					return {
						instructor: instructor.firstName + ' ' + instructor.lastName,
						id: course.id,
						courseName: course.courseName,
						startDate: course.startDate,
						endDate: course.endDate,
					}
				})
			)

			response.render('dashboard-student', { responseBody, userCourses })
		} catch (err) {
			console.error('Error retrieving courses:', err)
			request.flash('error', 'There was some error in retrieving your courses')
			response.redirect('/dashboard')
		}

	}
}

const getProfile = async (request, response) => {
	try {
		const user = await User.findOne({ where: { id: request.user.id } })
		response.render('profile', { user })
	}
	catch (err) {
		request.flash('error', 'Could not fetch Profile')
		console.log(err)
		response.redirect('/dasboard')
	}
}

const updatePassword = async (request, response) => {
	try {
		const { currentPassword, newPassword, confirmPassword } = request.body
		const user = await User.findOne({ where: { id: request.user.id } })

		const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

		if (!isPasswordValid) {
			request.flash('error', 'Current password is incorrect.')
			return response.redirect('/profile')
		}

		if (newPassword !== confirmPassword) {
			request.flash('error', 'New password and confirm password do not match.')
			return response.redirect('/profile')
		}

		const hashedPassword = await bcrypt.hash(newPassword, salt)

		await User.update({ password: hashedPassword }, { where: { id: request.user.id } })

		request.flash('success', 'Password updated successfully.')
		response.redirect('/dashboard')
	} catch (err) {
		console.error(err)
		request.flash('error', 'Error updating password.')
		response.redirect('/profile')
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
	getProfile,
	updatePassword
}
