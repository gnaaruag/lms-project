const checkEducator = (request, response, next) => {
	if (request.user && request.user.accessLevel == 'educator') {
		return next()
	}
	else {
		response.status(401).json({ message: 'Unauthorised user.'})

	}
}

const checkStudent = (request, response, next) => {
	if (request.user && request.user.accessLevel == 'student') {
		return next()
	}
	else {
		response.status(401).json({ message: 'Unauthorised user.'})
		
	}
}

module.exports = { checkEducator, checkStudent }