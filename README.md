# lms-project

This is a Learning Management System project

Students can register for courses, and learn and complete courses.

Educators can create a course and have students enrol in them

Each Course has Chapters

Each Chapter can have multiple Modules(smaller Sections in a Chapter)

Each Module has pages which can be read by the user and marked as complete

Each page can have content in it and along with it have code blocks, blockquotes, images, links etc.


- [Installation](#installation)
- [Features](#features)
- [User Flow Diagram](#userflow)
- [Database Schema](#database-schema)
- [Technologies Used](#technologies-used)


## Installation

To get started with this project
1. Clone the repository:

```
https://github.com/gnaaruag/lms-project.git
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
![Landing Page](https://github.com/gnaaruag/lms-project/assets/68043860/4b281ed0-d46f-4a13-a62b-76188a830583)
![Student Dashboard](https://github.com/gnaaruag/lms-project/assets/68043860/dd6b5078-4ec8-4427-ab83-37a56c3058c4)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/cb5a6f92-b932-4eef-8511-6f94db1256f8)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/0051a823-3ce8-47c6-a151-7b422b906710)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/a5eb9a8e-0188-41cc-843b-2da027d7d411)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/2a3fe8cb-6d61-4bf0-925d-cdf064461c8c)
![image](https://github.com/gnaaruag/lms-project/assets/68043860/6ea754b2-175b-4901-9ceb-1b6844337bfc)






