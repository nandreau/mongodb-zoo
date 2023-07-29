import express from 'express';
import { connectToDatabase } from '../db.js';
import { isAuth } from '../middleware/is-auth.js';
import { body } from 'express-validator';
import feedController from '../controllers/feed.js'; 

const router = express.Router();
router.use(express.json());

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /feed/products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Renvoie un tableau de produits.
 *       401:
 *         description: Non autorisé - Token manquant ou invalide.
 */

router.get('/products', isAuth, feedController.getProducts);

/**
 * @swagger
 * /feed/product:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objet JSON représentant le produit à créer.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               price:
 *                 type: number
 *                 minimum: 0
 *               description:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       201:
 *         description: Produit créé avec succès.
 *       400:
 *         description: Corps de la requête invalide - Vérifiez les propriétés du produit.
 *       401:
 *         description: Non autorisé - Token manquant ou invalide.
 */

router.post(
  '/product',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('price')
      .isFloat({ min: 0 }),
    body('description')
      .trim()
      .isLength({ min: 5 }),
  ],
  feedController.createProduct
);

/**
 * @swagger
 * /feed/product/{productId}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit à récupérer.
 *     responses:
 *       200:
 *         description: Renvoie les détails du produit.
 *       401:
 *         description: Non autorisé - Token manquant ou invalide.
 *       404:
 *         description: Produit introuvable.
 */

router.get('/product/:productId', isAuth, feedController.getProduct);

/**
 * @swagger
 * /feed/product/{productId}:
 *   put:
 *     summary: Mettre à jour un produit par ID
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit à mettre à jour.
 *     requestBody:
 *       description: Objet JSON représentant les propriétés mises à jour du produit.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               price:
 *                 type: number
 *                 minimum: 0
 *               description:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       200:
 *         description: Mise à jour du produit réussie.
 *       400:
 *         description: Corps de la requête invalide - Vérifiez les propriétés du produit.
 *       401:
 *         description: Non autorisé - Token manquant ou invalide.
 *       404:
 *         description: Produit introuvable.
 */

router.put(
  '/product/:productId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('price')
      .isFloat({ min: 0 }),
    body('description')
      .trim()
      .isLength({ min: 5 }),
  ],
  feedController.updateProduct
);

/**
 * @swagger
 * /feed/product/{productId}:
 *   delete:
 *     summary: Supprimer un produit par ID
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit à supprimer.
 *     responses:
 *       200:
 *         description: Suppression du produit réussie.
 *       401:
 *         description: Non autorisé - Token manquant ou invalide.
 *       404:
 *         description: Produit introuvable.
 */

router.delete('/product/:productId', isAuth, feedController.deleteProduct);

export default router;
