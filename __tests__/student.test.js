/* eslint-disable*/

const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const { User, Course, Chapter, Enrollment, Module, Page, status } = require('../models')
const bcrypt = require('bcrypt')


let server, agent


describe('Student module test sute', function () {
	beforeAll(async () => {
		await db.sequelize.sync({ force: true });
		server = app.listen(4000, () => { });
		agent = request.agent(server);

		// create educator to create course
		let res = await agent.get("/signup-educator");
		res = await agent.post("/onboard").send({
			firstName: "Test",
			lastName: "User",
			email: "user@faculty.edu",
			password: "test-user",
			accessLevel: 'educator'
		});

		// login
		res = await agent.get('/login')
		res = await agent.post('/session-create').send({
			email: 'user@faculty.edu',
			password: 'test-user'
		});

		// create a test course
		const user = await User.findOne({ where: { email: 'user@faculty.edu' } })

		res = await agent.get('/create-course')
		res = await agent.post('/create-course').send({
			courseName: 'Test Course',
			startDate: new Date().toISOString().slice(0, 10),
			endDate: new Date().toISOString().slice(0, 10),
			enrollmentDeadline: new Date().toISOString().slice(0, 10),
			description: 'this is a test course',
			prerequisites: 'this, is, a, test, course',
			tags: 'test, course',
			userId: user.id
		})

		// creaet chapter
		const course = await Course.findOne({ where: { courseName: 'Test Course' } })

		res = await agent.post('/add-chapter').send({
			chapterName: 'test chapter',
			chapterNumber: 1,
			courseId: course.id
		})

		// create chapter module
		const chapter = await Chapter.findOne({ where: { title: 'test chapter' } })

		res = await agent.post('/add-module').send({
			moduleNumber: 1,
			moduleTitle: 'test module',
			chapterId: chapter.id
		})

		// create page
		const module = await Module.findOne({ where: { title: 'test module' } })

		res = await agent.post('/add-page').send({
			pageNo: 1,
			pageTitle: 'test page',
			pageContent: 'This is a test page',
			moduleId: module.id
		})

		// signout from educator

		res = await agent.get('/signout')

		// create student account

		res = await agent.get('/signup-student')
		res = await agent.post("/onboard").send({
			firstName: "Test",
			lastName: "User",
			email: "user@student.edu",
			password: "testtesttest",
			accessLevel: 'student'
		});

		// login to student account

		res = await agent.get('/login')
		res = await agent.post('/session-create').send({
			email: 'user@student.edu',
			password: 'testtesttest'
		});

	})

	afterAll(async () => {
		try {
			await db.sequelize.close();
			await server.close();
		} catch (error) {
			console.log(error);
		}
	});

	test('enroll user into course', async () => {
		let res = await agent.get('/enroll/1')

		const enrollmentStatus = await Enrollment.findOne({ where: { courseId: 1, userId: 2 } })

		expect(enrollmentStatus).toBeTruthy()
	})

	test('get student prifile', async () => {
		let res = await agent.get("/profile");
		expect(res.statusCode).toBe(200);
		expect(res).toBeTruthy();
	});

	test('test update password', async () => {
		let res = await agent.post('/update-password').send({
			currentPassword: 'testtesttest',
			newPassword: "newpassword",
			confirmPassword: "newpassword"
		})
		const testpass = "newpassword"
		const user = await User.findOne({ where: { id: 2 } })
		const isPasswordValid = await bcrypt.compare(testpass, user.password)

		expect(isPasswordValid).toBe(true)
	})

	test('mark as read feature for page', async () => {
		let res = await agent.get('/status/1')

		const checkStatus = await status.findOne({where: {pageId: 1, userId: 2}})
		expect(checkStatus).toBeTruthy() 
	})


})