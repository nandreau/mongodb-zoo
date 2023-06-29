import jwt from 'jsonwebtoken'

export const isAuthentified = (req, res, next) => {
    // les jwt sont sur un header appele Authorization
    // sous la forme : 'Bearer token'
    // { Authorization: 'Bearer token' }

    const authentificationHeader = req.get('Authorization')

    if (!authentificationHeader) {
        // gestion de l'absencec du header au sein de la requete entrante
    }

    const token = authentificationHeader.split(' ')[1];
    let validatedToken;
    try {
        validatedToken = jwt.verify(token, 'votre super secret dans .env')
    } catch (error) {
        // gestion d'une eventuelle erreyr
    }
    if (!validatedToken) {
        // gestion de l'erreur
        // trouver les codes d'erreur correspondant 
        // 401, ...
    }
    req.userId = validatedToken.userId;
    next();
}