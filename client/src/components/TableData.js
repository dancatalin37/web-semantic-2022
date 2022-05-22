import React, { useEffect } from "react";
import { Table } from "react-bootstrap";

const TableData = (props) => {
  useEffect(() => {}, [props]);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Medication ID</th>
            <th>Medication name</th>
            <th>Date added</th>
            <th>Alternative names</th>
            <th>Price Per Unit</th>
            <th>Prescriptions</th>
          </tr>
        </thead>

        <tbody>
          {props &&
            props.props?.map((prop, index) => (
              <tr key={index}>
                <td>{prop.id}</td>
                <td>{prop.name}</td>
                <td>{prop.dateAdded}</td>
                <td>
                  {" "}
                  {prop.alternativeNames.map((name, index) => (
                    <li key={index}>{name + ", "}</li>
                  ))}
                </td>
                <td>{prop.pricePerUnit}</td>
                <td>
                  {prop.prescriptions.map((prescription, index) => (
                    <li key={index}>
                      <strong> Patient: </strong>
                      {prescription.patient}
                      <strong> Prescriped for: </strong>
                      {prescription.prescripedFor}
                      <strong> Compensated: </strong>
                      {prescription.compensated ? " true " : " false "}
                    </li>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableData;
