const { Course, Chapter } = require('../models')



const requestCourseCreation = (request, response) => {
	response.render('create-course')
}

const requestChapterCreation = (request, response) => {
	const sendId = {
		id: request.params.id,
	}
	response.render('create-chapter', { sendId })
}

const createCourse = async (request, response) => {
	// eslint-disable-next-line no-unused-vars
	try {
		// eslint-disable-next-line no-unused-vars
		const course = await Course.create(
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

		response.redirect(`/course-confirmation/${course.id}`)
	}
	catch (err) {
		request.flash('error', 'Course could not be created')
		console.log(err)
	}
}

const createChapter = (request, response) => {
	try {
		// eslint-disable-next-line no-unused-vars
		const chapter = Chapter.create(
			{
				chapterNo: request.body.chapterNumber,
				title: request.body.chapterName,
				courseId: request.body.courseId
			}
		)
		response.redirect(`/chapter-confirmation/${request.body.courseId}`)
	}
	catch (err) {
		request.flash('error', 'chapter could not be created')
		console.log(err)
	}
}

const serveCourseConfirmation = (request, response) => {
	const sendId = {
		id: request.params.id,
	}
	response.render('course-confirmation', { sendId })
}

const serveChapterConfirmation = (request, response) => {
	const sendId = {
		id: request.params.id,
	}
	response.render('chapter-confirmation', { sendId })
}

const viewCourse = async (request, response) => {
	try {
		const chapterList = await Chapter.findAll({ where: { courseId: request.params.id } })
		const courseInfo = await Course.findOne({ where: { id: request.params.id } })
		response.render('course-overview', { chapterList, courseInfo })

	}
	catch (err) {
		console.log(err)
	}
}

module.exports = { requestCourseCreation, createCourse, serveCourseConfirmation, requestChapterCreation, createChapter, serveChapterConfirmation, viewCourse }