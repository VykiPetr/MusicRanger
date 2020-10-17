const mongoose = require('mongoose')

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
        // enum: allCountry
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
            // enum: allRoles
        }
    }, ],
    bandlookingfor: [{
        type: String,
        // enum: roleList
    }],
    mainGenre: {
        type: String,
        // enum: allRoles
    },
    subGenre: String,
})

module.exports  = mongoose.model('band', bandSchema)