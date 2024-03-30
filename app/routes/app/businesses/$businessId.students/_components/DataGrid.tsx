import { selectColumn } from './SelectWidget';
import {
  DataSheetGrid,
  createTextColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@remix-run/react';
import { CourseType, StudentType } from '~/types/collection';

const css = `
  .dsg-cell.classes-row {
    overflow: scroll;
  }
`;

const emailColumn = createTextColumn({
  parseUserInput: (string) => string + '@',
});

export interface StudentInDatagrid extends StudentType {
  courses: CourseType[];
  courseIds: CourseType['id'][];
}

type Props = {
  students: StudentInDatagrid[];
  courses: CourseType[];
  updateData: (students: StudentInDatagrid[]) => void;
};

function DataGrid({ students, courses, updateData }: Props) {
  const [studentsData, setStudentsData] =
    useState<StudentInDatagrid[]>(students);

  const columns = [
    {
      ...keyColumn('name', textColumn),
      title: '이름',
    },
    {
      ...keyColumn('phone_number', textColumn),
      title: '전화번호',
    },
    {
      ...keyColumn('email', emailColumn),
      title: '이메일',
    },
    {
      ...keyColumn(
        'courseIds',
        selectColumn({
          choices: courses.map((course) => ({
            value: course.id,
            label: course.name,
          })),
        })
      ),
      title: '수업',
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
        rowHeight={50}
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
