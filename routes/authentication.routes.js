const express = require("express");
// eslint-disable-next-line no-unused-vars
const app = express();
const route = express.Router();

const {
  requestStudentSignup,
  requestEducatorSignup,
  requestLogin,
  onboardUser,
  createSession,
  destroySession,
} = require("../controllers/authentication.controller");

route.get("/login", requestLogin);
route.get("/signup-student", requestStudentSignup);
route.get("/signup-educator", requestEducatorSignup);
route.post("/onboard", onboardUser);
route.post("/session-create", createSession);
route.get("/signout", destroySession);

module.exports = route;
