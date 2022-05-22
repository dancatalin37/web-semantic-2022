const express = require("express");
const cors = require("cors");
const { json } = express;
const app = express();
const PORT = 3030;

const prescriptionRoutes = require("./routes/prescriptionRoutes");
const medicationRoutes = require("./routes/medicationRoutes");

app.use(cors({ origin: true, credentials: true }));
app.use(json());

app.use("/", prescriptionRoutes);
app.use("/", medicationRoutes);

app.listen(PORT, () => {
  console.log("Listening on port..." + PORT);
});
