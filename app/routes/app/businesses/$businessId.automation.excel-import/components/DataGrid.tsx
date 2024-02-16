import 'react-datasheet-grid/dist/style.css';

import { useState } from 'react';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';

interface StudentRow {
  id: number;
  name: string;
  phoneNumber: string;
  parentPhoneNumber: string;
  email: string;
  birthday: string;
  note: string;
  school: string;
}

const createEmptyRow = (): StudentRow => ({
  id: Math.random(), // Simple way to get a unique id, consider a more robust approach for a real app
  name: 'name',
  phoneNumber: '',
  parentPhoneNumber: '',
  email: '',
  birthday: '',
  note: '',
  school: '',
});

export default function StudentDataSheet() {
  // Initialize with 100 empty rows
  const [data, setData] = useState<StudentRow[]>(Array.from({ length: 100 }, createEmptyRow));
console.log(data)
  const columns = [
    { ...keyColumn('name', textColumn), title: 'Name' },
    { ...keyColumn('phoneNumber', textColumn), title: 'Phone Number' },
    { ...keyColumn('parentPhoneNumber', textColumn), title: 'Parent Phone Number' },
    { ...keyColumn('email', textColumn), title: 'Email' },
    { ...keyColumn('birthday', textColumn), title: 'Birthday' },
    { ...keyColumn('note', textColumn), title: 'Note' },
    { ...keyColumn('school', textColumn), title: 'School' },
  ];

  return (
    <DataSheetGrid
      createRow={() => (createEmptyRow())}
      value={data}
      onChange={setData}
      columns={columns}
    />
  );
}
