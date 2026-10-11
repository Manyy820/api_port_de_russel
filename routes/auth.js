const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/user');

// POST : connexion d'un utilisateur
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier les champs
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email et mot de passe obligatoires'
            });
        }

        // Rechercher l'utilisateur
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Comparer le mot de passe avec son hash
        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Enregistrer l'utilisateur dans la session
        req.session.userId = user._id.toString();

        res.status(200).json({
            message: 'Connexion réussie',
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la connexion'
        });
    }
});

// GET : déconnexion de l'utilisateur
router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: 'Erreur lors de la déconnexion'
            });
        }

        res.clearCookie('connect.sid');

        res.status(200).json({
            message: 'Déconnexion réussie'
        });
    });
});

const requireAuth = require('../middlewares/auth');

// GET : informations de l'utilisateur connecté
router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        res.status(200).json({
            username: user.username,
            email: user.email
        });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du profil'
        });
    }
});

module.exports = router;
