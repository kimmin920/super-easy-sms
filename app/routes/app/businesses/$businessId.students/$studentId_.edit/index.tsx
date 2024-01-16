import { Button } from '@/components/ui/button';
import { useNavigate } from '@remix-run/react';

function EditStudent() {
  const navigate = useNavigate();

  return (
    <div>
      Edit Students
      <Button onClick={() => navigate(-1)} type='button'>
        GO BACK
      </Button>
    </div>
  );
}

export default EditStudent;
