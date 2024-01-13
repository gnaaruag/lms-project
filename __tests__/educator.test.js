/* eslint-disable */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const { User, Course, Chapter, Module, Page } = require("../models");

let server, agent
//mock authentication middleware
// .sendconst mockAuthMiddleware = (request, response, next) => {
// 	request.user = { id: 1, accessLevel: 'educator' };
// 	next();
// };

describe('Educator module test suite', function () {
	beforeAll(async () => {
		await db.sequelize.sync({ force: true });
		server = app.listen(4000, () => { });
		agent = request.agent(server);

		// crete a dummy educator user

		let res = await agent.get("/signup-educator");
		res = await agent.post("/onboard").send({
			firstName: "Test",
			lastName: "User",
			email: "user@faculty.edu",
			password: "test-user",
			accessLevel: 'educator'
		});

		res = await agent.get('/login')
		res = await agent.post('/session-create').send({
			email: 'user@faculty.edu',
			password: 'test-user'
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

	test("test to create course", async () => {

		const user = await User.findOne({ where: { email: 'user@faculty.edu' } })

		let res = await agent.get('/create-course')
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

		expect(res.statusCode).toBe(302)
		const course = await Course.findOne({ where: { userId: 1 } })
		expect(course.userId).toBe(1)
	})

	test("test to create chapter", async () => {
		const course = await Course.findOne({ where: { courseName: 'Test Course' } })

		let res = await agent.post('/add-chapter').send({
			chapterName: 'test chapter',
			chapterNumber: 1,
			courseId: course.id
		})

		expect(res.statusCode).toBe(302)
		const chapter = await Chapter.findOne({ where: { title: 'test chapter' } })
		expect(chapter.chapterNo).toBe(1)
	})

	test("test to create module", async () => {
		const chapter = await Chapter.findOne({ where: { title: 'test chapter' } })

		let res = await agent.post('/add-module').send({
			moduleNumber: 1,
			moduleTitle: 'test module',
			chapterId: chapter.id
		})

		expect(res.statusCode).toBe(302)
		const module = await Module.findOne({ where: { title: 'test module' } })
		expect(module.moduleNo).toBe(1)
		expect(module.chapterId).toBe(chapter.id)
	})

	test("test to create page", async () => {
		const module = await Module.findOne({ where: { title: 'test module' } })

		let res = await agent.post('/add-page').send({
			pageNo: 1,
			pageTitle: 'test page',
			pageContent: 'This is a test page',
			moduleId: module.id
		})

		expect(res.statusCode).toBe(302)
		const page = await Page.findOne({ where: { title: 'test page' } })
		expect(page.content).toBe('This is a test page')
	})
})