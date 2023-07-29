import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const AuthController = {
  signup: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Inscription échouée');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);

    try {
      const utilisateur = new User(email, hashedPw, name);
      await utilisateur.save();
      res.status(201).json({ message: 'Utilisateur créé !', userId: utilisateur._id });
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
    }
  },

  login: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Connexion échouée');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const email = req.body.email;
    const password = req.body.password;
    let utilisateurCharge;
    User.findOne({ email: email })
      .then(utilisateur => {
        if (!utilisateur) {
          const erreur = new Error('Un utilisateur avec cet e-mail est introuvable.');
          erreur.statusCode = 401;
          throw erreur;
        }
        utilisateurCharge = utilisateur;
        return bcrypt.compare(password, utilisateur.password);
      })
      .then(estIdentique => {
        if (!estIdentique) {
          const erreur = new Error('Mauvais mot de passe !');
          erreur.statusCode = 401;
          throw erreur;
        }
        const token = jwt.sign(
          {
            email: utilisateurCharge.email,
            userId: utilisateurCharge._id.toString()
          },
          'somesupersecretsecret',
          { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, userId: utilisateurCharge._id.toString() });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
};

export default AuthController;