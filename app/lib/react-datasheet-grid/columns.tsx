/* eslint-disable no-useless-escape */
import {  CellProps, createTextColumn, textColumn } from "react-datasheet-grid";
import { isValidEmail } from "./validation";

export const phoneNumberComponent = ({ rowData }: CellProps) => {
    return (
      <div>
        {rowData} 호!
      </div>
    )
  }

  export const phoneNumberColumn = createTextColumn({
    parsePastedValue: (value) => value.replace(/\-/g, ''),
    parseUserInput: (value) => value.replace(/\-/g, ''),
  })

  // export const emailColumn = createTextColumn({
  //   parseUserInput: (string) => string + '@',
  // });

  export const emailColumn = () => ({
    ...textColumn,
    key: 'email',
    title: 'Email',
    // style: {
    //   border: '1px solid red'
    // }
    // component: ({ rowData, setRowData }) => (
    //   <input
    //     type="email"
    //     value={rowData.email}
    //     onChange={(e) => {
    //       setRowData({ ...rowData, email: e.target.value });
    //     }}
    //     style={{
    //       borderColor: isValidEmail(rowData.email) ? 'green' : 'red',
    //       borderWidth: '2px',
    //     }}
    //   />
  

  });