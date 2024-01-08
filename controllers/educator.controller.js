const { Course } = require('../models')



const requestCourseCreation = (request, response) => {
	response.render('create-course')
}

const createCourse = async (request, response) => {
	// eslint-disable-next-line no-unused-vars
	console.log(request.body)
	console.log(request.body.tags)

	console.log(request.body.tags.split(', '))
	// eslint-disable-next-line no-unused-vars
	const course = Course.create(
		{
			courseName: request.body.courseName,
			startDate: request.body.startDate,
			endDate: request.body.endDate,
			description: request.body.description,
			price: request.body.price,
			prerequisites: request.body.prerequisites.split(', '),
			enrollmentDeadline: request.body.enrollmentDeadline,
			courseInstructor: request.user.id,
			userId: request.user.id,

			tags: request.body.tags.split(',').map(tag => tag.trim())
		}
	)

	response.redirect('/dashboard')
}

module.exports = { requestCourseCreation, createCourse }