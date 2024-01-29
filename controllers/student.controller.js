/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { response } = require('express')
const { User, Course, Chapter, Enrollment, Module, Page, status } = require('../models')
const Sequelize = require('sequelize')
const marked = require('marked')


const requestExplore = async (request, response) => {
	try {
		const courses = await Course.findAll({order: [['id', 'DESC']]})

		for (const enroll of courses) {
			const currCount = await Enrollment.count({where: {courseId: enroll.id}})
			enroll.registrations = currCount
		}
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

		let totalPages = 0
		let completedPages = 0

		for (const chapter of chapters) {
			const modules = await Module.findAll({
				where: { chapterId: chapter.id },
				include: [{ model: Page }]
			})

			for (const module of modules) {
				for (const page of module.Pages) {
					totalPages++
					const pageStatus = await status.findOne({
						where: { pageId: page.id, userId: request.user.id }
					})

					if (pageStatus && pageStatus.completed) {
						completedPages++
					}
				}
			}
		}

		const completionPercentage = (completedPages / totalPages) * 100

		response.render('student-course-entry-point', { course, chapters, instructor, completionPercentage })
	}
	catch (err) {
		request.flash('error', 'Could not fetch course')
	}

}

const chapterOverview = async (request, response) => {
	try {
		const chapter = await Chapter.findOne({ where: { id: request.params.id } })
		let completedPages = 0
		let totalPages = 0

		const modulesWithPages = await Module.findAll({
			where: { chapterId: request.params.id },
			include: [
				{
					model: Page
				},
			],
		})

		for (const mod of modulesWithPages) {
			for (const page of mod.Pages) {
				const pageStatus = await status.findOne({ where: { pageId: page.id, userId: request.user.id } })
				if (pageStatus && pageStatus.completed) {
					completedPages++
					totalPages++
					page.Status = true
				} else {
					totalPages++
					page.Status = false
				}
			}
		}

		response.render('student-chapter-overview', { chapter, modulesWithPages })
	} catch (err) {
		request.flash('error', 'Could not fetch course content')
		console.log(err)
	}
}


const pageView = async (request, response) => {
	try {

		const page = await Page.findOne({ where: { id: request.params.id } })
		page.content = marked.parse(page.content)
		const mod = await Module.findOne({ where: { id: page.moduleId } })
		const chapter = await Chapter.findOne({ where: { id: mod.chapterId } })
		const course = await Course.findOne({ where: { id: chapter.courseId } })
		const currStatus = await status.findOne({ where: { pageId: request.params.id, userId: request.user.id } })
		response.render('student-page-view', {
			page,
			chapter,
			course,
			currStatus
		})
	}
	catch (err) {
		request.flash('error', 'Could not fetch Page')
		console.log(err)
		response.redirect('/')
	}
}

const updateStatus = async (request, response) => {
	try {

		const currentStatus = await status.findOne({ where: { pageId: request.params.id, userId: request.user.id } })

		if (!currentStatus) {

			const newStatus = await status.create({
				completed: true,
				userId: request.user.id,
				pageId: request.params.id
			})
		}

		response.redirect(`/page/${request.params.id}`)

	}
	catch (err) {
		request.flash('error', 'Could not Mark Page as Completed')
		console.log(err)
		response.redirect(`/page/${request.params.id}`)
	}
}


module.exports = {
	requestExplore,
	studentCourseOverview,
	enrollStudentToCourse,
	courseEntryPoint,
	chapterOverview,
	pageView,
	updateStatus,
}