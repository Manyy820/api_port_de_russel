const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');

// GET : récupérer tous les catways
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET : récupérer un catway par son numéro
router.get('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOne({
      catwayNumber: Number(req.params.id)
    });

    if (!catway) {
      return res.status(404).json({
        message: 'Catway introuvable'
      });
    }

    res.status(200).json(catway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST : ajouter un catway
router.post('/', async (req, res) => {
  try {
    const catway = new Catway(req.body);
    const savedCatway = await catway.save();
    res.status(201).json(savedCatway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

 // PUT : modifier uniquement l'état d'un catway
router.put('/:id', async (req, res) => {
  try {
    const { catwayState } = req.body;

    if (typeof catwayState !== 'string' ||
        catwayState.trim() === '') {
      return res.status(400).json({
        message: 'Un état valide est obligatoire'
      });
    }

    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: Number(req.params.id) },
      { $set: { catwayState } },
      { new: true, runValidators: true }
    );

    if (!catway) {
      return res.status(404).json({
        message: 'Catway introuvable'
      });
    }

    res.status(200).json(catway);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// DELETE : supprimer un catway
router.delete('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({
      catwayNumber: Number(req.params.id)
    });

    if (!catway) {
      return res.status(404).json({
        message: 'Catway introuvable'
      });
    }

    res.status(200).json({
      message: 'Catway supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

