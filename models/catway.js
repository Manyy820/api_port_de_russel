const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema(
    {
        catwayNumber: {
            type: Number,
            required: true,
            unique: true
        },
        catwayType: {
            type: String,
            enum: ["long", "short"],
            required: true
        },
        catwayState: {
            type: String,
            required: true
        }
    },
    {
        collection: "catways",
        versionKey: false
    }
);

module.exports = mongoose.model("Catway", catwaySchema);
