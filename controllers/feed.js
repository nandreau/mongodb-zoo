import { validationResult } from 'express-validator';
import Product from '../models/product.js';

const feedController = {
  getProducts: async (req, res, next) => {
    try {
      const produits = await Product.findAll();
      res.json(produits);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits :', error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des produits.' });
    }
  },

  createProduct: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Création du produit échouée');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const { title, price, description } = req.body;
    try {
      const product = new Product(title, price, description);
      await product.save();
      res.status(201).json({ message: 'Produit créé avec succès !', idProduit: product._id });
    } catch (error) {
      console.error('Erreur lors de la création du produit :', error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la création du produit.' });
    }
  },

  getProduct: async (req, res, next) => {
    const idProduit = req.params.productId;
    try {
      const produit = await Product.findById(idProduit);
      if (!produit) {
        return res.status(404).json({ error: 'Produit introuvable.' });
      }
      res.json(produit);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit :', error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du produit.' });
    }
  },

  updateProduct: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Update du produit échouée');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const idProduit = req.params.productId;
    const { title, price, description } = req.body;
    try {
      const updatedProduct = await Product.updateById(idProduit, title, price, description);
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: 'Produit introuvable.' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du produit.' });
    }
  },

  deleteProduct: async (req, res, next) => {
    const idProduit = req.params.productId;
    try {
      const isDeleted = await Product.deleteById(idProduit);
      if (isDeleted) {
        res.json({ message: 'Produit supprimé avec succès.' });
      } else {
        res.status(404).json({ error: 'Produit introuvable.' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du produit.' });
    }
  },
};

export default feedController;