/* eslint-disable*/
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const { User } = require("../models");
const bcrypt = require("bcrypt");

let server, agent;

describe("Authentication module test suite", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);

    // crete a dummy educator user

    let res = await agent.get("/signup-educator");
    res = await agent.post("/onboard").send({
      firstName: "Test",
      lastName: "User",
      email: "user@faculty.edu",
      password: "test-user",
    });

    res = await agent.get("/signup-student");
    res = await agent.post("/onboard").send({
      firstName: "Test",
      lastName: "User",
      email: "user.test@gmail.com",
      password: "test-user",
    });
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("test creation of an educator account", async () => {
    let res = await agent.get("/signup-educator");
    res = await agent.post("/onboard").send({
      firstName: "Test",
      lastName: "User",
      email: "user.test@test.com",
      password: "test-password",
      accessLevel: "educator",
    });
    expect(res.statusCode).toBe(302);

    const user = await User.findOne({
      where: { email: "user.test@test.com" },
    });
    console.log(user);

    expect(user).toBeTruthy();
    expect(user.accessLevel).toBe("educator");
  });

  test("test creation of an student account", async () => {
    let res = await agent.get("/signup-educator");
    res = await agent.post("/onboard").send({
      firstName: "Test",
      lastName: "User",
      email: "user.test@student.com",
      password: "test-password",
      accessLevel: "student",
    });
    expect(res.statusCode).toBe(302);

    const user = await User.findOne({
      where: { email: "user.test@student.com" },
    });
    console.log(user);

    expect(user).toBeTruthy();
    expect(user.accessLevel).toBe("student");
  });

  test("test creation of account with email that already exists", async () => {
    let res = await agent.get("/signup-educator");
    res = await agent.post("/onboard").send({
      firstName: "Test",
      lastName: "User",
      email: "user@faculty.edu",
      password: "test-password",
      accessLevel: "student",
    });
    expect(res.statusCode).toBe(302);

    const user = await User.findAll({
      where: { email: "user@faculty.edu" },
    });
    console.log(user);

    expect(user.length).toBe(1);
  });

  test("test login endpoint when correct credentials are provided", async () => {
    let res = await agent.get("/login");
    res = await agent.post("/session-create").send({
      email: "user@faculty.edu",
      password: "test-user",
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });

  test("test login endpoint when account does not exist", async () => {
    let res = await agent.get("/login");
    res = await agent.post("/session-create").send({
      email: "thisuserdoesnotexist@gmail.com",
      password: "whats the point of password even",
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/login");
  });

  test("test login endpoint when incorrect password provided", async () => {
    let res = await agent.get("/login");
    res = await agent.post("/session-create").send({
      email: "user@faculty.edu",
      password: "wrong pwd",
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/login");
  });
  test("test /signout endpoint", async () => {
    let res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);

    /*
            note: add check by trying to access protected route when a protected route is defined
        */
    res = await agent.get("/dashboard");
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toBe("/login");

  });
});
