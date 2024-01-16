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
import { allClasses } from '../../$businessId.classes/_mockdata';
import { students } from '../_mockdata';

const emailColumn = createTextColumn({
  parseUserInput: (string) => string + '@',
});

function DataGrid() {
  // const { students } = useStudents();
  // const { class: allClass } = useClass();

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
        'class',
        selectColumn({
          choices: allClasses.map((eachClass) => ({
            value: eachClass.id,
            label: eachClass.name,
          })),
        })
      ),
      title: 'class',
      flex: 1,
    },
  ];

  return <DataSheetGrid value={students} columns={columns} />;
}

export default DataGrid;
