const mongoose = require("mongoose")

const noteSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        content: {
            type: String,
            require: true,
        },
        creationDate: {
            type: Date,
            default: Date.now()
        }
    }
)

module.exports = mongoose.model("Note", noteSchema)