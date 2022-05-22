const axios = require("axios");

const JSON_API_ENDPOINT_MEDICATIONS = "http://localhost:4000/medications";

exports.getMedications = async (req, res) => {
  const result = await axios.get(JSON_API_ENDPOINT_MEDICATIONS);
  res.status(200).json({ medications: result.data });
};
