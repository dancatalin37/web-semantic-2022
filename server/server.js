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

const SparqlClient = require("sparql-http-client");
let arr = [];

app.get("/rdf4j", async (req, res) => {
  const endpointUrl =
    "http://localhost:8080/rdf4j-workbench/repositories/websemanticproiect/query";
  const query = `
  PREFIX : <http://axicatawebsemantic.ro#>
SELECT DISTINCT ?patient ?meds ?prescripedFor ?dueDate ?compensated
WHERE
{
 ?presciption :hasName ?patient;
 :hasMedications/:hasMedicationName ?meds;
 :prescripedFor ?prescripedFor;
 :dueDate ?dueDate;	
 :compensated ?compensated;
}
`;

  const client = new SparqlClient({ endpointUrl });
  const stream = await client.query.select(query);

  stream.on("data", (row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (!arr.includes(row)) {
        arr.push(row);
      }
      console.log(`${key}: ${value.value} (${value.termType})`);
    });
  });

  stream.on("error", (err) => {
    console.error(err);
  });

  setTimeout(() => res.status(200).json({ message: arr }), 1000);
});
