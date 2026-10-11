require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db.js");
const catwayRoutes = require('./routes/catways.js');
const reservationRoutes = require('./routes/reservations');
const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = require('./routes/users');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const requireAuth = require('./middlewares/auth');
const path = require('path');
const Reservation = require('./models/reservation.js');

// Permet de lire les données envoyées en JSON
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use('/', authRoutes);

app.use('/catways/:id/reservations', requireAuth, reservationRoutes);
app.use('/catways', requireAuth, catwayRoutes);
app.use('/users', requireAuth, userRoutes);

app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Page de gestion des catways
app.get('/catways-page', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'catways.html'));
});

 // Page de gestion des réservations
app.get('/reservations-page', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reservations.html'));
});

 // Page de gestion des utilisateurs
app.get('/users-page', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users.html'));
});
// Page de documentation de l'API
app.get('/api-docs', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doc_api.html'));
});
 // GET : récupérer les réservations en cours
app.get('/reservations/current', requireAuth, async (req, res) => {
    try {
        const today = new Date();

        const reservations = await Reservation.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        }).sort({ startDate: 1 });

        res.status(200).json(reservations);

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des réservations'
        });
    }
});

// Route de vérification de l'API
app.get("/api/status", (req, res) => {
    res.json({
        message: "API Port Russell opérationnelle",
        database: "MongoDB",
        status: "ok"
    });
});

// Démarrage après connexion à MongoDB
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
}

startServer();
