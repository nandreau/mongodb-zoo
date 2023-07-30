// middleware/error-handler.js

function errorHandler(err, req, res, next) {
    console.error(err);

    // Définition du code d'état HTTP et du message par défaut
    let statusCode = 500;
    let errorMessage = 'Erreur interne du serveur.';

    // Gestion des erreurs spécifiques
    if (err.name === 'ValidationError') {
        // Erreurs de validation (express-validation)
        statusCode = 400;
        errorMessage = 'Bad request. Veuillez vérifier les erreurs de validation.';
    } else if (err.name === 'UnauthorizedError') {
        // Erreurs d'authentification
        statusCode = 401;
        errorMessage = 'Accès non autorisé. Veuillez vous connecter.';
    } else if (err.name === 'ForbiddenError') {
        // Erreurs de droits d'accès
        statusCode = 403;
        errorMessage = 'Accès refusé. Vous n\'avez pas les droits requis.';
    }

    // Envoi de la réponse avec le code d'état et le message appropriés
    res.status(statusCode).json({ error: errorMessage });
}

module.exports = errorHandler;
