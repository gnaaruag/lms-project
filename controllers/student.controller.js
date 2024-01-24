/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { User, Course, Chapter, Enrollment, Module, Page } = require('../models')

const requestExplore = async (request, response) => {
	try {
		const courses = await Course.findAll()
		response.render('explore-courses', { courses })
	}
	catch (err) {
		request.flash('error', 'There was a problem in retrieving all courses')
		console.log(err)
	}
}

const studentCourseOverview = async (request, response) => {
	try {
		const course = await Course.findOne({ where: { id: request.params.id } })
		const instructor = await User.findOne({ where: { id: course.userId } })
		const chapters = await Chapter.findAll({ where: { courseId: course.id } })

		console.log('peepee'.course)
		console.log(instructor)
		response.render('student-course-overview', { course, instructor, chapters })
	}

	catch (err) {
		request.flash('error', 'There was a problem in retrieving course')
		console.log(err)
	}
}

const enrollStudentToCourse = async (request, response) => {
	try {
		// eslint-disable-next-line no-unused-vars

		const isAlreadyEnrolled = await Enrollment.findOne({
			where: {
				courseId: request.params.id,
				userId: request.user.id
			}
		})

		console.log('enrollleddd', isAlreadyEnrolled)
		if (!isAlreadyEnrolled) {

			const enroll = await Enrollment.create({
				isEnrolled: true,
				userId: request.user.id,
				courseId: request.params.id,
			})
			response.redirect('/dashboard')
		}

		else {
			request.flash('error', 'You have already enrolled in the course')
			response.redirect('/dashboard')
		}



	}
	catch (err) {
		request.flash('error', 'Could\'nt Register to course')
		console.log(err)
	}
}

const courseEntryPoint = async (request, response) => {
	try {

		const course = await Course.findOne({ where: { id: request.params.id } })
		const instructor = await User.findOne({ where: { id: course.userId } })
		const chapters = await Chapter.findAll({ where: { courseId: course.id } })
		console.log('peepee', course)
		response.render('student-course-entry-point', { course, chapters, instructor })
	}
	catch (err) {
		request.flash('error', 'Could not fetch course')
	}

}

const chapterOverview = async (request, response) => {
	try {
		const chapter = await Chapter.findOne({ where: { id: request.params.id } })
		const modulesWithPages = await Module.findAll({
			where: { chapterId: request.params.id },
			include: [
				{
					model: Page,
				},
			],
		})

		console.log(modulesWithPages)
		response.render('student-chapter-overview', { chapter, modulesWithPages})
	}
	catch (err) {
		request.flash('error', 'Could not fetch course content')
		console.log(err)
	}
}

const pageView = async (request, response) => {
	try {
		const page = await Page.findOne({ where: {id: request.params.id} })
		response.render('student-page-view', { page })
	}
	catch (err) {
		request.flash('error', 'Could not fetch Page')
		console.log(err)
	}
}

module.exports = {
	requestExplore,
	studentCourseOverview,
	enrollStudentToCourse,
	courseEntryPoint,
	chapterOverview,
	pageView,
}