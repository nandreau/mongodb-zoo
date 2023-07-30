import express from 'express';
import { body } from 'express-validator';

import AuthController from '../controllers/auth.js';
import User from '../models/user.js';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /signup:
 *   put:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Endpoint pour inscrire un nouvel utilisateur en utilisant un email, un mot de passe et un nom.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Informations de l'utilisateur à inscrire.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: Utilisateur inscrit avec succès.
 *       400:
 *         description: Mauvaise demande. Veuillez vérifier les erreurs de validation.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  AuthController.signup
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion d'un utilisateur existant
 *     description: Endpoint pour connecter un utilisateur existant en utilisant son email et son mot de passe.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Informations de l'utilisateur à connecter.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès.
 *       400:
 *         description: Mauvaise demande. Veuillez vérifier les erreurs de validation.
 *       401:
 *         description: Identifiants invalides. L'utilisateur n'existe pas ou le mot de passe est incorrect.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Veuillez entrer une adresse e-mail valide.')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Le mot de passe doit être présent et comporter au moins 5 caractères.')
  ],
  AuthController.login
);

export default router;