require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');
const connectDB = require('./config/db');

async function importReservations() {
    try {
        // Connexion à MongoDB Atlas
        await connectDB();

        // Lecture du fichier reservations.json
        const data = JSON.parse(
            fs.readFileSync('./reservations.json', 'utf-8')
        );

        // Sélection de la collection reservations
        const collection = mongoose.connection.collection('reservations');

        // Vérification pour éviter les doublons
        const count = await collection.countDocuments();

        if (count > 0) {
            console.log('La collection contient déjà des réservations.');
        } else {
            const result = await collection.insertMany(data);

            console.log(
                `${result.insertedCount} réservations importées avec succès !`
            );
        }

    } catch (error) {
        console.error('Erreur :', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

importReservations();
