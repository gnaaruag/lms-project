const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const path = require('path')
const passport = require('passport')
// const connectEnsureLogin = require('connect-ensure-login')
const session = require('express-session')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const favicon = require('serve-favicon')
// eslint-disable-next-line no-unused-vars
const marked = require('marked')

// eslint-disable-next-line no-undef
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')))
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')))



const { User } = require('./models')

// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'))
app.use(flash())

// const salt = 10

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.set('view engine', 'ejs')

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(cookieparser('sfkdslhhihJHUH'))

app.use(
	session({
		secret:
			'some random secreat jillsjdpoisivkasfjsdfksddslvskndknldvsknldvsl iamgoinginsanehelppppppppppp',
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
		},
	}),
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				const user = await User.findOne({ where: { email: username } })

				if (user) {
					const revert = await bcrypt.compare(password, user.password)
					if (revert) {
						return done(null, user)
					} else {
						return done(null, false, { message: 'Invalid Password' })
					}
				} else {
					return done(null, false, { message: 'Invalid Password or Username' })
				}

				// User.findOne({ where: { email: username } })
				// 	.then(async (user) => {
				// 		const revert = await bcrypt.compare(password, user.password)
				// 		if (revert) {
				// 			return done(null, user)
				// 		} else {
				// 			return done(null, false, { message: 'Invalid Password' })
				// 		}
				// 	})
				// 	.catch((error) => {
				// 		return error
				// 	})
			} catch (err) {
				console.log(err)
			}
		},
	),
)

passport.serializeUser((user, done) => {
	console.log('Serializing user in session', user.id)
	done(null, user.id)
})

passport.deserializeUser((id, done) => {
	User.findByPk(id)
		.then((user) => {
			done(null, user)
		})
		.catch((error) => {
			done(null, error)
		})
})

app.use(function (request, response, next) {
	response.locals.messages = request.flash()
	next()
})

app.get('/', (request, response) => {
	if (request.isAuthenticated()) {
		return response.redirect('/dashboard')
	}
	response.render('landing-page')
})



const authenticationModule = require('./routes/authentication.routes')
const educatorModule = require('./routes/educator.route')
const studentModule = require('./routes/student.routes')

app.use('/', authenticationModule)
app.use('/', educatorModule)
app.use('/', studentModule)

app.get('*', (request, response) => {
	response.render('404')
})

module.exports = app
