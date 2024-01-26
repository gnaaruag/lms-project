# lms-project

This is the first iteration of the Learning Management System project made as a submission for the capstone project for Pupilfirst's WD201 course

- [Installation](#installation)
- [Features](#features)
- [User Flow Diagram](#userflow)
- [Database Schema](#database-schema)
- [Technologies Used](#technologies-used)


## Installation

To get started with this project
1. Clone the repository:

```
git clone https://github.com/your-username/your-project.git
```

2. Navigate to the project directory:

```
cd lms-project
```

3. Install dependencies:

```
npm install
```

4. Set up the Database

```
npx sequelize-cli db:migrate

```

5. Start the Application
```
npm start
```

## Features

#### User Authentication:
User registration and login.
Differentiation between student and educator accounts.
Password hashing for security.

#### Course Management:
Creation of courses by educators.
Assignment of educators to their respective courses.
Display of course details, including name, duration, and description.

#### Chapter and Module Creation:
Addition of chapters within a course.
Creation of modules within each chapter.

#### Page and Content Management:
Creation of pages for modules.
Addition of educational content to pages.

#### Enrollment and Registration:
Students can enroll in courses.
Tracking of course enrollment status.

#### Dashboard:
Display of relevant information upon user login.
Overview of enrolled courses for students.
Overview of created courses for educators.

#### Educator Onboarding:
Special registration process for educators.
Setup for educator profiles.

#### Middleware for Access Control:
Implementation of middleware to check user access levels.
Authorization checks for certain routes.

#### Course Analytics:
View analytics for each course.
Display the number of students enrolled in each course.

#### Password Update:
Ability for users to update their passwords securely.

#### Student Course Overview:
Presentation of a student's enrolled courses with details.
Chapter Overview:

#### Educator Analytics:
Analytics for educators to track the number of students enrolled in their courses.

## Userflow

Below is a userflow diagram I sketched at the start of the project
![image](https://github.com/gnaaruag/lms-project/assets/68043860/233075ae-6ca8-4cf2-a415-6e13d0cacdb1)

## Database Schema

Below is the database Schema I have used
![image](https://github.com/gnaaruag/lms-project/assets/68043860/02d5ac93-cad0-4a31-b250-2f5d63131015)

## Technologies Used

### Frontend

##### HTML/CSS/JavaScript:
- The core building blocks for the user interface and interactivity.

##### Tailwind CSS:
- A utility-first CSS framework used for styling components.

##### EJS (Embedded JavaScript):
- A template engine for rendering dynamic content on the server side.

### Backend

##### Node.js:
- A JavaScript runtime used for building scalable network applications.

##### Express.js:
- A web application framework for Node.js, facilitating the creation of robust APIs and web applications.

##### Passport.js:
- A middleware for user authentication.

##### Sequelize:
- A promise-based Node.js ORM for PostgreSQL, MySQL, MariaDB, SQLite, and Microsoft SQL Server.

### Database

##### PostgreSQL:
An open-source relational database management system used to store application data.

### Testing

##### Jest:
- A JavaScript testing framework for unit testing.

#####  Supertest:
- A library for HTTP assertions and testing HTTP servers.

## Application Screenshots
![image](https://github.com/gnaaruag/lms-project/assets/68043860/05febeab-8719-4ba4-83fe-0301f2934884)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/06e79432-4ce5-48f1-9895-f7997076cfc2)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/7d0b953c-0cf9-4ed0-b6d7-f06f84c5e803)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/ff284de8-55db-4003-ada6-780d34e03386)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/d448ac1c-d446-4962-a617-8fa78a2e62d5)


