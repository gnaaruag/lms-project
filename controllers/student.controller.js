// eslint-disable-next-line no-unused-vars
const { User, Course, Chapter } = require('../models')

const requestExplore = async (request, response) => {
	try {
		const courses = await Course.findAll()
		response.render('explore-courses', {courses})
	}
	catch (err) {
		request.flash('error', 'There was a problem in retrieving all courses')
		console.log(err)
	} 
}

const studentCourseOverview = async (request, response) => {
	try {
		const course = await Course.findOne( {where : { id: request.params.id }} )
		const instructor = await User.findOne( {where : { id: course.userId }} )
		const chapters = await Chapter.findAll( {where: { courseId: course.id}} )
		response.render( 'student-course-overview', {course, instructor, chapters} )
	}

	catch (err) {
		request.flash('error', 'There was a problem in retrieving course')
		console.log(err)
	} 
}

module.exports = {requestExplore, studentCourseOverview}