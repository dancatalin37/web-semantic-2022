import React, { useEffect } from "react";
import { Table } from "react-bootstrap";

const SecondTableData = (props) => {
  useEffect(() => {}, [props]);

  console.log(props);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Prescriped for</th>
            <th>Due Date</th>
            <th>Compensated</th>
            <th>Medication</th>
          </tr>
        </thead>

        <tbody>
          {props &&
            props.props?.map((prop, index) => (
              <tr key={index}>
                <td>{prop.patient.value}</td>
                <td>{prop.prescripedFor.value}</td>
                <td>{prop.dueDate.value}</td>
                <td>{prop.compensated.value}</td>
                <td>{prop.meds.value}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SecondTableData;
