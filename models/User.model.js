const mongoose = require('mongoose')

//set lists for the enum of country, genre and role.  Prevents changes being made to database by user.
let {allCountries} = require('../lib/countriesList')
let {mainGenreList} = require('../lib/mainGenreList')
let {mainRoleList} = require('../lib/mainRoleList')

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
	country: {
		type: String,
		 enum: [...allCountries]
		},
	mainGenre: {
		type: String,
		enum: [...mainGenreList],
		},
	mainRole: {
		type: String,
		enum: [...mainRoleList],
		},
    listed: false
    })

    module.exports  = mongoose.model('user', userSchema)