import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "./HomeStyling.css";
import TableData from "./TableData";
import SecondTableData from "./SecondTableData";
import ThirdTableData from "./ThirdTableData";

const HomePage = () => {
  const PRESCRIPTIONS_API_ENDPOINT = "http://localhost:3030/prescription";
  const MEDICATIONS_API_ENDPOINT = "http://localhost:3030/medications";
  const GRAPHQL_ENDPOINT = "http://localhost:3000/";
  const RDF_ENDPOINT = "http://localhost:3030/rdf4j";

  const [patient, setPatient] = useState("");
  const [prescripedFor, setPrescripedFor] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [compensated, setCompensated] = useState(false);
  const [medicationId, setMedicationId] = useState(1);
  const [response, setResponse] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showSecondTable, setShowSecondTable] = useState(false);
  const [showThirdTable, setShowThirdTable] = useState(false);
  const [fetchedMedications, setFetchedMedications] = useState([]);
  const [graphQLResponse, setGraphQLResponse] = useState([]);
  const [rdfResponse, setrdfResponse] = useState([]);

  const checkIfCompensated = (value) => {
    value === "True" ? setCompensated(true) : setCompensated(false);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      patient,
      prescripedFor,
      dueDate,
      compensated,
      medicationId: parseInt(medicationId),
    };
    await axios
      .post(PRESCRIPTIONS_API_ENDPOINT, data, {
        withCredentials: false,
      })
      .then((res) => {
        setResponse(res.data);
        setShowTable(true);
      })
      .catch((error) => console.log(error));

    setPatient("");
    setDueDate("");
    setMedicationId();
    setPrescripedFor("");
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(MEDICATIONS_API_ENDPOINT);
      setFetchedMedications(result.data);
    };
    fetchData();
  }, []);

  const medsArray = [];
  const prescriptionsArray = [];

  response.forEach((object) => {
    const medication = {
      name: object.name,
      description: object.description,
      dateAdded: object.dateAdded,
      alternativeNames: object.alternativeNames,
      canBeTakenWithoutPrescription: object.canBeTakenWithoutPrescription,
      pricePerUnit: object.pricePerUnit,
    };
    medsArray.push(medication);
    object.prescriptions.forEach((prescription) => {
      prescriptionsArray.push(prescription);
    });
  });

  async function sendDataToGraphQL(meds, prescriptions) {
    meds.forEach((med) => {
      axios({
        url: GRAPHQL_ENDPOINT,
        method: "post",
        data: {
          query: `mutation {
          createMedication(name: "${med.name}", description: "${med.description}", dateAdded: "${med.dateAdded}", alternativeNames: "${med.alternativeNames}", canBeTakenWithoutPrescription: ${med.canBeTakenWithoutPrescription}, pricePerUnit: ${med.pricePerUnit}) {
            id, name
          }
        }
        `,
        },
      })
        .then()
        .catch((error) => console.log(error.response.data));
    });
    prescriptions.forEach((prescription) => {
      axios({
        url: GRAPHQL_ENDPOINT,
        method: "post",
        data: {
          query: `mutation {
          createPrescription(patient: "${
            prescription.patient
          }", prescripedFor: "${prescription.prescripedFor}", dueDate: "${
            prescription.dueDate
          }", compensated: ${prescription.compensated}, medication_id: ${
            prescription.medicationId + 1
          }) {
            patient, medication_id
          }
        }
        `,
        },
      })
        .then(response)
        .catch((error) => console.log(error.response.data));
    });
    axios({
      url: GRAPHQL_ENDPOINT,
      method: "post",
      data: {
        query: `{
          allMedications{id, name, description, dateAdded, alternativeNames, canBeTakenWithoutPrescription, pricePerUnit, Prescriptions{id, patient, prescripedFor
          , compensated, medication_id}}
        }
      `,
      },
    })
      .then((response) => {
        setGraphQLResponse(response);
        setShowSecondTable(true);
      })
      .catch((error) => console.log(error.response.data));
  }

  const handleRDFGetRequest = async (req, res) => {
    const result = await axios(RDF_ENDPOINT);
    setrdfResponse(result.data.message);
    setShowThirdTable(true);
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="prescription-header mt-5 mb-5 d-flex justify-content-center">
          Add a new prescription
        </div>
        <div className="container-fluid d-flex justify-content-center">
          <div className="row">
            <div className="">
              <form onSubmit={onFormSubmit}>
                <div className="row mt-4">
                  <div className="form-group col-sm-5">
                    <label className="label-form">Patient</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Patient's complete name"
                      value={patient}
                      onChange={(e) => setPatient(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-sm-5">
                    <label className="label-form">Prescriped for:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Prescription purpose"
                      value={prescripedFor}
                      onChange={(e) => setPrescripedFor(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-sm-5 mt-3">
                    <label className="label-form">Valid until: </label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Choose when the prescription expires"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-sm-5 mt-3">
                    <label className="label-form">Select medication</label>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        setMedicationId(e.target.value);
                      }}
                    >
                      {" "}
                      {fetchedMedications.medications &&
                        fetchedMedications.medications?.map((medication) => (
                          <option value={medication.id} key={medication.id}>
                            {medication.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group col-sm-5 mt-2">
                    <label className="label-form">Compensated:</label>
                    <select
                      className="form-control"
                      id="compensated"
                      name="compensated"
                      onChange={(e) => checkIfCompensated(e.target.value)}
                    >
                      <option value="False">False</option>
                      <option value="True">True</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={
                    patient === "" || prescripedFor === "" || dueDate === ""
                  }
                  className="btn btn-primary col-lg-10 mt-4"
                >
                  Insert prescription and fetch the rest of prescriptions
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-5">
        {response && showTable == true ? (
          <div className="row">
            <TableData props={response} />
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary col-lg-10 mt-4 "
                onClick={() => sendDataToGraphQL(medsArray, prescriptionsArray)}
              >
                Insert and retrieve data from the second server
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <hr size="8" width="100%" color="red" />
      <div className="container-fluid mt-5">
        {graphQLResponse && showSecondTable == true ? (
          <div className="row">
            <div className="prescription-header mt-5 mb-5 d-flex justify-content-center">
              Data from GraphQL Server
            </div>
            <SecondTableData props={graphQLResponse.data.data.allMedications} />
          </div>
        ) : null}
      </div>

      <div className="d-flex justify-content-center mt-5">
        {graphQLResponse && showSecondTable == true ? (
          <button
            className="btn btn-primary col-lg-10 "
            onClick={handleRDFGetRequest}
          >
            Data from the third server
          </button>
        ) : null}
      </div>
      <div className="container-fluid mt-5">
        {rdfResponse && showThirdTable == true ? (
          <div className="row">
            <div className="prescription-header mt-5 mb-5 d-flex justify-content-center">
              Data from RDF Response
            </div>
            <ThirdTableData props={rdfResponse} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage;
