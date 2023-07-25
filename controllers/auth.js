import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const hashedPw = await bcrypt.hash(password, 12);

  const db = req.app.locals.db;
  try {
    const result = await db.collection('users').insertOne({
      email: email,
      password: hashedPw,
      name: name,
    });
    res.status(201).json({ message: 'User created!', userId: result.insertedId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'An error occurred while creating the user.' });
  }
};

export const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('Un utilisateur avec cet e-mail est introuvable.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Mauvais mot de passe!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
