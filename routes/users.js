const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET : récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

 // POST : créer un nouvel utilisateur
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier que tous les champs sont renseignés
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Vérifier si l'adresse email existe déjà
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

        if (existingUser) {
            return res.status(409).json({
                message: 'Cette adresse email est déjà utilisée'
            });
        }

        // Créer le nouvel utilisateur
        const user = new User({
            username,
            email,
            password
        });

        // Enregistrer dans MongoDB
        // Le mot de passe est haché par le modèle User
        await user.save();

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

 // GET : récupérer un utilisateur par son email
router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim();

        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

const bcrypt = require('bcrypt');

// PUT : modifier un utilisateur par son email
router.put('/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim();
        const { username, password } = req.body;

        // Rechercher l'utilisateur
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        // Modifier le nom si renseigné
        if (username !== undefined) {
            user.username = username;
        }

        // Modifier le mot de passe si renseigné
        if (password !== undefined) {
            user.password = password;
        }

        // Sauvegarder les modifications
        await user.save();

        res.status(200).json({
            message: 'Utilisateur modifié avec succès',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

 // DELETE : supprimer un utilisateur par son email
router.delete('/:email', async (req, res) => {
    try {
        // Vérifier que l'utilisateur ne supprime pas son propre compte
if (req.session.userId) {
    const currentUser = await User.findById(req.session.userId);

    if (currentUser && currentUser.email === req.params.email.toLowerCase()) {
        return res.status(403).json({
            message: 'Vous ne pouvez pas supprimer votre propre compte.'
        });
    }
}
        const email = req.params.email.toLowerCase().trim();

        // Rechercher et supprimer l'utilisateur
        const user = await User.findOneAndDelete({ email });

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        res.status(200).json({
            message: 'Utilisateur supprimé avec succès'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
