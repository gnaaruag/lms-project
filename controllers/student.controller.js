/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { response } = require('express')
const { User, Course, Chapter, Enrollment, Module, Page, status } = require('../models')
const Sequelize = require('sequelize')
const marked = require('marked')
const fs = require('fs')
const moment = require('moment')
const Pdf = require('pdfkit')


const requestExplore = async (request, response) => {
	try {
		const courses = await Course.findAll({ order: [['id', 'DESC']] })

		for (const enroll of courses) {
			const currCount = await Enrollment.count({ where: { courseId: enroll.id } })
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

const certGen = async (request, response) => {
	try {
		const imagePath = __dirname + '/certificate.png'
		const parisienne = __dirname + '/fonts/Parisienne-Regular.ttf'
		const ovo = __dirname + '/fonts/Ovo-Regular.ttf'
		const poppins = __dirname + '/fonts/Poppins-Regular.ttf'

		const doc = new Pdf({
			layout: 'landscape',
			size: 'A4'
		})

		const course = await Course.findOne({ where: { id: request.params.id } })
		const user = await User.findOne({ where: { id: request.user.id } })
		const instr = await User.findOne({ where: { id: course.userId } })
		const name = user.firstName + ' ' + user.lastName
		const inst = instr.firstName + ' ' + instr.lastName
		const text1 = 'Presented for completion of course'
		const text2 = course.name

		console.log(user,instr)
		// Create PDF
		doc.pipe(fs.createWriteStream(`${name}.pdf`))
		doc.image(imagePath, 0, 0, { width: 800 })

		// Font settings
		doc.font(parisienne).fontSize(60).text(name, 20, 255, { align: 'center' })
		doc.font(poppins).fontSize(15).text(text1, 60, 330, { align: 'center' })
		doc.font(poppins).fontSize(15).text(text2, 60, 350, { align: 'center' })
		doc.font(ovo).fontSize(24).text(inst, 365, 430, { align: 'center' })

		// End PDF creation
		doc.end(() => {
			console.log('PDF generated successfully!')

			// Set response headers
			response.setHeader('Content-disposition', 'attachment filename=' + `${name}.pdf`)
			response.setHeader('Content-type', 'application/pdf')

			// Pipe the filestream to the response
			const filestream = fs.createReadStream(`${name}.pdf`)
			filestream.pipe(response)

			// Ensure response is properly closed
			response.end()
		})
	} catch (err) {
		console.error('Error during PDF generation:', err)
		response.status(500).send('Internal Server Error')
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
	certGen
}