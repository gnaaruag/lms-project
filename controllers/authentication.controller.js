const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");

const salt = 10;

const requestStudentSignup = (request, response) => {
  response.render("signup-student");
};

const requestLogin = (request, response) => {
  response.render("login");
};

const requestEducatorSignup = (request, response) => {
  response.render("signup-educator");
};

const onboardUser = async (request, response) => {
  console.log(request.body);
  if (request.body.accessLevel === "educator") {
    if (request.body.email.length == 0) {
      request.flash("error", "Email cannot empty!");
      return response.redirect("/signup-educator");
    }

    if (
      request.body.firstName.length == 0 ||
      request.body.lastName.length == 0
    ) {
      request.flash("error", "Enter your name");
      return response.redirect("/signup-educator");
    }
    if (request.body.password.length < 8) {
      request.flash("error", "Password must be atleast 8 characters");
      return response.redirect("/signup-educator");
    }
  } else {
    if (request.body.email.length == 0) {
      request.flash("error", "Email cannot empty!");
      return response.redirect("/signup-student");
    }

    if (
      request.body.firstName.length == 0 ||
      request.body.lastName.length == 0
    ) {
      request.flash("error", "Enter your name");
      return response.redirect("/signup-student");
    }
    if (request.body.password.length < 8) {
      request.flash("error", "Password must be atleast 8 characters");
      return response.redirect("/signup-student");
    }
  }

  const hashed = await bcrypt.hash(request.body.password, salt);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashed,
      accessLevel: request.body.accessLevel,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/dashboard");
    });
  } catch (error) {
    console.log(error);
    request.flash("error", "Couldnt create user. Try again!");
  }
};

// eslint-disable-next-line no-unused-vars
const createSession = (request, response, next) => {
  console.log(request);
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  })(request, response, () => {
    // This function is called upon successful authentication

    response.redirect("/dashboard");
  });
};

const destroySession = (request, response, next) => {
  request.logOut((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
};

module.exports = {
  requestStudentSignup,
  requestEducatorSignup,
  requestLogin,
  onboardUser,
  createSession,
  destroySession,
};
