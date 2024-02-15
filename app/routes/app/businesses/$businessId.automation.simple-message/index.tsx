import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import { Database } from "~/types/supabase";
import { StudentWithCourse } from "~/types/collection";
import { useActionData, useLoaderData } from "@remix-run/react";
import SMSTemplateSwitcher from "../$businessId.automation.super-easy-sms/_components/SMSTemplateSwitcher";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import TemplateParser from "../$businessId.automation.super-easy-sms/_components/TemplateParser";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import StudentsSwitcher from "~/components/StudentsSwitcher";

import { templateMessageInjector } from "../$businessId.automation.super-easy-sms/utils";
import { Card } from "@/components/ui/card";


export const loader = async ({  params }: LoaderFunctionArgs) => {
    const businessId = params.businessId;
  
    if (!businessId) {
      return redirect('/404');
    }
  
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select(`*, courses: classes(*), courseIds: classes(id)`)
      .eq('business_id', businessId);
  
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .eq('business_id', businessId);

      const { data: templates, error: templatesError } = await supabase
        .from('sms_templates')
        .select('*')
        .eq('business_id', businessId);

  
    const formattedStudents: StudentWithCourse[] =
      students?.map((student) => ({
        ...student,
        courseIds: student.courseIds.map((each) => each.id),
      })) ?? [];
  
    return {
      students: formattedStudents,
      classes: classes ?? [],
      templates: templates ?? [],
      studentsError,
      classesError,
    };
  };


export const action = async ({ request, params }: ActionFunctionArgs) => {
  const businessId = params.businessId;

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (!businessId) {
    throw Error;
  }

  const { data, error } = await supabase
    .from('sms_templates')
    .insert({
      template: values.template as Json,
      title: values.title as string,
      business_id: businessId,
    })
    .select()
    .limit(1)
    .single();

  return { data, error };
};

function SimpleMessagePage() {
    const { students, templates } = useLoaderData<typeof loader>();
    const data = useActionData();

    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(() => {
        if (templates.length > 0) {
        return templates[0].id
        }

        return null
    });

    const [selectedStudent, setSelectedStudent] = useState<StudentWithCourse | null>(null);

    useEffect(() =>{
      if (!data?.data) {
        return;
      }

      setSelectedTemplateId(data.data.id)
    },[data])

    const selectedTemplate = templates.find(
        (each) => each.id === selectedTemplateId
    );

    function onClickTemplate(id: number) {
        setSelectedTemplateId(id);
    }

    function onClickStudent(id:number) {
        const student = students.find(student => student.id === id);
        student && setSelectedStudent(student);
    }

    const jsonContent = selectedTemplate && JSON.parse(selectedTemplate.template);
    const messagePreview = selectedTemplate && selectedStudent && templateMessageInjector(jsonContent.content, {
      학생이름: selectedStudent.name,
      정산시작일: '[N/A]',
      정산종료일: '[N/A]',
      정산금액: '[N/A]',
  });

    return (
        <>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>심플 메세지</h2>
            <p className='text-muted-foreground'>
               학생들에게 간단히 메세지를 보내세요.
               <br />
               "@학생이름"만 사용 가능합니다.
            </p>
          </div>
        </div>

        <Separator className='my-4' />

        <div className="flex flex-col space-y-3 p-2">

        <div className='flex flex-col space-y-2'>
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">학생 선택</Label>
            <StudentsSwitcher selectedStudentId={selectedStudent?.id ?? null} students={students} onClickTemplate={onClickStudent} />
        </div>

        <div className='flex flex-col space-y-2'>
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">문자 템플릿 선택</Label>
            <SMSTemplateSwitcher 
                className='w-[200px] mt-2'
                selectedTemplateId={selectedTemplateId}
                messageTemplates={templates}
                onClickTemplate={onClickTemplate}
            />
        </div>

        <div>
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">미리보기</Label>

            {messagePreview ? <Card className='w-[300px] px-4 py-2 mt-2 rounded-md'>{messagePreview}</Card>
            : <>
            {selectedTemplate?.template && ( <TemplateParser template={selectedTemplate.template} /> )}
            </>
            }
        </div>
        </div>
        <div className="flex items-center justify-end mt-6">
          <a
            href={`sms:${selectedStudent?.phoneNumber}&body=${messagePreview}`}
            onClick={(e) => {
              if (!selectedStudent || !messagePreview) {
                e.preventDefault();
              }
            }}
           >
            <Button disabled={!selectedStudent || !messagePreview}>
                SMS 보내기
            </Button>
            </a>
        </div>
        {/* <StudentsDataTable data={students} defaultColumnVisibility={{ status: false, email: false }} /> */}
      </>
  )
}

export default SimpleMessagePage