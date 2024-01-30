const { Course, Chapter, Module, Page, Enrollment } = require('../models')
const marked = require('marked')



const requestCourseCreation = (request, response) => {
	response.render('create-course')
}

const requestChapterCreation = async (request, response) => {
	const sendId = {
		id: request.params.id,
	}

	try {
		const chapters = await Chapter.findAll({ where: { courseId: request.params.id } })
		const chapter = await Chapter.findOne({ where: { courseId: request.params.id } })
		console.log(chapter)
		response.render('create-chapter', { sendId, chapters, chapter })
	}
	catch (err) {
		request.flash('error', 'there was some problem in retrieving chapters')
		console.log(err)
	}
}

const requestModuleCreation = async (request, response) => {
	const sendId = {
		id: request.params.id,
	}

	try {
		const modules = await Module.findAll({
			where: { chapterId: request.params.id }
		})

		const module = await Module.findOne({
			where: { chapterId: request.params.id }
		})
		response.render('create-module', { sendId, modules, module })
	}
	catch (err) {
		request.flash('error', 'there was some problem in retrieving modules')
		console.log(err)
	}

}

const requestPageCreation = async (request, response) => {
	const sendId = {
		id: request.params.id,
	}

	try {
		const pages = await Page.findAll({ where: { moduleId: request.params.id } })
		response.render('create-page', { sendId, pages })
	}
	catch (err) {
		request.flash('error', 'there was a problem in fetching all pages')
	}
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

const createModule = (request, response) => {
	try {
		// eslint-disable-next-line no-unused-vars
		const module = Module.create({
			moduleNo: request.body.moduleNumber,
			title: request.body.moduleTitle,
			chapterId: request.body.chapterId
		})
		response.redirect(`/module-confirmation/${request.body.chapterId}`)
	}

	catch (err) {
		request.flash('error', 'module could not be created')
		console.log(err)
	}
}

const createPage = (request, response) => {
	try {
		// eslint-disable-next-line no-unused-vars
		const page = Page.create({
			pageNo: request.body.pageNo,
			title: request.body.pageTitle,
			content: request.body.pageContent,
			moduleId: request.body.moduleId,
		})

		response.redirect(`/page-confirmation/${request.body.moduleId}`)
	}
	catch (err) {
		request.flash('error', 'could not create a page')
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

const serveModuleConfirmation = (request, response) => {
	const sendId = {
		id: request.params.id,
	}
	response.render('module-confirmation', { sendId })
}


const servePageConfirmation = async (request, response) => {
	const sendId = {
		moduleId: request.params.id,
	}

	const module = await Module.findOne({ where: { id: request.params.id } })
	const chapter = await Chapter.findOne({ where: { id: module.chapterId } })


	response.render('page-confirmation', { sendId, chapter })
}

const viewCourse = async (request, response) => {
	try {
		let courseInfo = await Course.findOne({
			where: { id: request.params.id },
			include: [
				{
					model: Chapter,
					include: [
						{
							model: Module,
							include: [
								{
									model: Page,
								},
							],
						},
					],
				},
			],
			order: [
				[Chapter, 'chapterNo', 'ASC'], // Order chapters by chapterNo in ascending order
				[Chapter, Module, 'moduleNo', 'ASC'], // Order modules by moduleNo in ascending order
				[Chapter, Module, Page, 'pageNo', 'ASC'], // Order pages by pageNo in ascending order
			],
		})

		courseInfo = courseInfo.get()
		response.render('course-overview', { courseInfo })

	}
	catch (err) {
		console.log(err)
	}
}

const viewPage = async (request, response) => {
	try {

		const page = await Page.findOne({ where: { id: request.params.id } })
		page.content = marked.parse(page.content)
		const mod = await Module.findOne({ where: { id: page.moduleId } })
		const chapter = await Chapter.findOne({ where: { id: mod.chapterId } })
		const course = await Course.findOne({ where: { id: chapter.courseId } })
		response.render('view-page', {
			page,
			chapter,
			course,
		})
	}
	catch (err) {
		request.flash('error', 'Could not fetch Page')
		console.log(err)
		response.redirect('/')
	}
}

const viewAnalytics = async (request, response) => {
	try {
		const courses = await Course.findAll({ where: { userId: request.user.id } })
		for (const enroll of courses) {
			const currCount = await Enrollment.count({ where: { courseId: enroll.id } })
			enroll.registrations = currCount
		}

		response.render('educator-analytics', { courses })
	}
	catch (err) {
		request.flash('error', 'couldnt fetch analytics')
		console.log(err)
	}
}

module.exports = {
	requestCourseCreation,
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
	viewPage,
	viewAnalytics
}