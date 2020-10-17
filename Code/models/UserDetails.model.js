const mongoose = require('mongoose')

const userDetailSchema = new mongoose.Schema(
    {
    userrefid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
	description: String,
	city: String,    
	subGenre: String,
	subRole: String,
	facebookurl: String,
	instagramurl: String,
	youtubeurl: String,
	soundcloudurl: String,
	spotifyurl: String,
	bandurllinks: [],
    })

    module.exports =  mongoose.model('userDetail', userDetailSchema)