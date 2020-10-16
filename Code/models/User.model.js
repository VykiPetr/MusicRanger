const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
    username: {
		required: true,
		unique: true,
		type: String,
	},
	password: {
		required: true,
		type: String ///Hashed
	},
	email: {
		unique: true,
		required: true,
		type: String,
	},
	img: String,
	Country: {
		type: String,
		// enum: allCountries
		},
	mainGenre: {
		type: String,
		// enum: allGenre,
		},
	mainrole: {
		type: String,
		// enum: allRoles,
		},
    listed: false
    })

    module.exports  = mongoose.model('user', userSchema)