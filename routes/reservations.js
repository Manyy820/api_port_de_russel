const express = require('express');
const router = express.Router({ mergeParams: true });
const Reservation = require('../models/reservation');

 // GET : récupérer les réservations d'un catway
router.get('/', async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);

        const reservations = await Reservation.find({
            catwayNumber: catwayNumber
        });

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


 // POST : créer une réservation pour un catway
router.post('/', async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);

        if (!Number.isInteger(catwayNumber) || catwayNumber <= 0) {
            return res.status(400).json({
                message: 'Numéro de catway invalide'
            });
        }

        const { clientName, boatName, startDate, endDate } = req.body;

        const reservation = new Reservation({
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate
        });

        const nouvelleReservation = await reservation.save();

        res.status(201).json(nouvelleReservation);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

 // GET : récupérer une réservation précise
router.get('/:idReservation', async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const idReservation = req.params.idReservation;

        const reservation = await Reservation.findOne({
            _id: idReservation,
            catwayNumber: catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({
                message: 'Réservation introuvable'
            });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

 // PUT : modifier une réservation
router.put('/', async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const { idReservation, clientName, boatName, startDate, endDate } = req.body;

        if (!idReservation) {
            return res.status(400).json({
                message: 'Identifiant de réservation obligatoire'
            });
        }

        const reservation = await Reservation.findOneAndUpdate(
            {
                _id: idReservation,
                catwayNumber: catwayNumber
            },
            {
                $set: {
                    clientName,
                    boatName,
                    startDate,
                    endDate
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!reservation) {
            return res.status(404).json({
                message: 'Réservation introuvable'
            });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

 // DELETE : supprimer une réservation précise
router.delete('/:idReservation', async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const idReservation = req.params.idReservation;

        const reservation = await Reservation.findOneAndDelete({
            _id: idReservation,
            catwayNumber: catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({
                message: 'Réservation introuvable'
            });
        }

        res.status(200).json({
            message: 'Réservation supprimée avec succès'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;
