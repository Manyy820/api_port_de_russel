require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');
const connectDB = require('./config/db');

async function importCatways() {
    try {
        // Connexion à MongoDB Atlas
        await connectDB();

        // Lecture du fichier JSON
        const data = JSON.parse(
            fs.readFileSync('./catways.json', 'utf-8')
        );

        // Importation dans la collection catways
        const collection = mongoose.connection.collection('catways');

        // Évite une deuxième importation accidentelle
        const count = await collection.countDocuments();

        if (count > 0) {
            console.log('La collection contient déjà des données.');
        } else {
            const result = await collection.insertMany(data);
            console.log(
                `${result.insertedCount} catways importés avec succès !`
            );
        }

    } catch (error) {
        console.error('Erreur :', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

importCatways();
