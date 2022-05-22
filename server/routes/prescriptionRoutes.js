const express = require("express");
const router = express.Router();

const { postPrescription } = require("../controllers/prescriptionController");

router.post("/prescription", postPrescription);
module.exports = router;
