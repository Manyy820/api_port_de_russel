const requireAuth = (req, res, next) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            message: 'Accès refusé. Veuillez vous connecter.'
        });
    }

    // Autoriser l'accès à la route suivante
    next();
};

module.exports = requireAuth;
