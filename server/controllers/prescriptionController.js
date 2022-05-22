const axios = require("axios");

const JSON_API_ENDPOINT = "http://localhost:4000/prescriptions";
const JSON_API_FETCH_PARENTS =
  "http://localhost:4000/medications?_embed=prescriptions";

exports.postPrescription = async (req, res) => {
  const data = {
    patient: req.body.patient,
    prescripedFor: req.body.prescripedFor,
    dueDate: req.body.dueDate,
    compensated: req.body.compensated,
    medicationId: req.body.medicationId,
  };

  await axios
    .post(JSON_API_ENDPOINT, data, {
      withCredentials: false,
    })
    .then(async () => {
      const retrieveAllPrescriptions = await axios.get(JSON_API_FETCH_PARENTS);
      res.status(200).json(retrieveAllPrescriptions.data);
    })
    .catch((err) => {
      res.status(200).json({ err: err.data });
    });
};
