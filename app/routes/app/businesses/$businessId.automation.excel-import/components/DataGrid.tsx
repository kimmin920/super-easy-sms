'use-client'

import 'react-datasheet-grid/dist/style.css';
import 'app/lib/react-datasheet-grid/styles.css'

import { useState } from 'react';
import { DataSheetGrid, textColumn, keyColumn, dateColumn, checkboxColumn } from 'react-datasheet-grid';
import {  phoneNumberColumn } from '~/lib/react-datasheet-grid/columns';
import { emailCellClassName, phoneNumberCellClassName } from '~/lib/react-datasheet-grid/validation';
import { Button } from '@/components/ui/button';
import { useLocation, useParams, useSubmit } from '@remix-run/react';

interface StudentRow {
  // id: number;
  active: boolean;
  name: string;
  phoneNumber: string;
  email: string;
  birthday: Date | null;
  school: string;
  note1: string;
  note2: string,
  business_id: number;
}

const createEmptyRow = (businessId: number): StudentRow => ({
  // id: Math.random(), // Simple way to get a unique id, consider a more robust approach for a real app,
  active: true,
  name: '',
  phoneNumber: '',
  email: '',
  birthday: null,
  school: '',
  note1: '',
  note2: '',
  business_id: businessId,
});


export default function StudentDataSheet() {
  const location = useLocation();
  const params = useParams();
  const businessId = Number(params.businessId)


  const [data, setData] = useState<StudentRow[]>(Array.from({ length: 10 }, () => createEmptyRow(businessId)));
  const submit = useSubmit();

  const columns = [
    {
      ...keyColumn('active', {...checkboxColumn, maxWidth: 50 }),
      title: '재원',
    },
    { ...keyColumn('name', textColumn), title: '이름' },
    { ...keyColumn('phoneNumber', {...phoneNumberColumn, cellClassName: phoneNumberCellClassName}), title: '전화번호', },
    { ...keyColumn('email', {...textColumn, cellClassName: emailCellClassName }), title: '이메일' },
    { ...keyColumn('birthday', dateColumn), title: '생년월일' },
    { ...keyColumn('school', textColumn), title: '학교' },
    { ...keyColumn('note1', textColumn), title: '메모1' },
    { ...keyColumn('note2', textColumn), title: '메모2' },
  ];

  function onClickSubmit() {

    const validData = data.filter(each => !!each.name);
    const formData = new FormData();
    formData.set("data", JSON.stringify(validData));
    submit(formData, { method: "post", action: location.pathname });
  }

  return (
    <>
    <DataSheetGrid
      createRow={() => createEmptyRow(businessId)}
      value={data}
      onChange={setData}
      columns={columns}
    />
    <div className='flex items-center justify-end space-x-2 py-4'>

      <Button type='button' onClick={onClickSubmit}>등록하기</Button>
    </div>
    </>
  );
}
