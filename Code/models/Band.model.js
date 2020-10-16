const mongoose = require('mongoose')

const bandSchema = new mongoose.Schema({
    bandName: {
        required: true,
        unique: true,
        type: String
    },
    img: String,
    description: String,
    Country: {
        type: String,
        // enum: allCountry
    },
    City: String,
    bandstructure: [{
        name: {
            type: String
        },
        profile_id: {
            type: mongoose._id
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