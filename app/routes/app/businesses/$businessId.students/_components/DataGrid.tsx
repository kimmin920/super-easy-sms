// import useClass from '@/stores/useClass';
// import useStudents from '@/stores/useStudents';
import { selectColumn } from './SelectWidget';
import {
  DataSheetGrid,
  createTextColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { Class, allClasses } from '../../$businessId.classes/_mockdata';
import { Student } from '../_mockdata';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@remix-run/react';

const css = `
  .dsg-cell.classes-row {
    overflow: scroll;
  }
`;

const emailColumn = createTextColumn({
  parseUserInput: (string) => string + '@',
});

type Props = {
  data: Student[];
  classes: Class[];
  updateData: (students: Student[]) => void;
};

function DataGrid({ data, classes, updateData }: Props) {
  const [studentsData, setStudentsData] = useState(data);

  const columns = [
    {
      ...keyColumn('name', textColumn),
      title: '이름',
    },
    {
      ...keyColumn('phoneNumber', textColumn),
      title: '전화번호',
    },
    {
      ...keyColumn('email', emailColumn),
      title: 'email',
    },
    {
      ...keyColumn(
        'classIds',
        selectColumn({
          choices: classes.map((eachClass) => ({
            value: eachClass.id,
            label: eachClass.name,
          })),
        })
      ),
      title: 'classes',
    },
  ];

  function handleClick() {
    updateData(studentsData);
  }

  return (
    <>
      <style>{css}</style>
      <DataSheetGrid
        value={studentsData}
        columns={columns}
        rowHeight={({ rowData, rowIndex }) => {
          return 50;
        }}
        onChange={setStudentsData}
      />

      <Form action='edit'>
        <Button type='submit' onClick={handleClick}>
          SUBMIT
        </Button>
      </Form>
    </>
  );
}

export default DataGrid;
