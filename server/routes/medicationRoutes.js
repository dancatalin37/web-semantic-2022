const express = require("express");
const router = express.Router();

const { getMedications } = require("../controllers/medicationController");

router.get("/medications", getMedications);

module.exports = router;
