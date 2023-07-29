import express from 'express';
import { body } from 'express-validator';

import AuthController from '../controllers/auth.js';
import User from '../models/user.js';

const router = express.Router();

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