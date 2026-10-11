const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'port_russell'
});

        console.log("Connexion à MongoDB réussie !");
    } catch (error) {
        console.error("Erreur de connexion à MongoDB :", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
