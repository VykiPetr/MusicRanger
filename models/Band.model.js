const mongoose = require('mongoose')

//set lists for the enum of country, genre and role.  Prevents changes being made to database by user.
let {allCountries} = require('../lib/countriesList')
let {mainGenreList} = require('../lib/mainGenreList')
let {mainRoleList} = require('../lib/mainRoleList')

const bandSchema = new mongoose.Schema({
  bandName: {
    required: true,
    unique: true,
    type: String
  },
  img: String,
  description: String,
  country: {
    type: String,
    enum: [...allCountries]
  },
  city: String,
  bandstructure: [{
    name: {
      type: String
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    role: {
      type: String,
      enum: [...mainRoleList]
    }
  }, ],
  bandlookingfor: [{
    type: String,
    // enum: roleList
  }],
  mainGenre: {
    type: String,
    enum: [...mainGenreList]
  },
  subGenre: String,
})

module.exports = mongoose.model('band', bandSchema)