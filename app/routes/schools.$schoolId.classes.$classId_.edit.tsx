import { Button } from '@/components/ui/button';
import { useNavigate } from '@remix-run/react';

function EditClass() {
  const navigate = useNavigate();

  return (
    <div>
      EditClass
      <Button onClick={() => navigate(-1)} type='button'>
        GO BACK
      </Button>
    </div>
  );
}

export default EditClass;
