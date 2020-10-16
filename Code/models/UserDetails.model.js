const mongoose = require('mongoose')

const userDetailSchema = new mongoose.Schema(
    {
    userrefid = {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
	description: String,
	City: String,    
	subGenre: String,
	subRole: String,
	faceebokurl: String,
	instagramurl: String,
	youtubeurl: String,
	soundcloudurl: String,
	spotifyurl: String,
	bandurllinks: [],
    })

    module.exports =  mongoose.model('userDetail', userDetailSchema)