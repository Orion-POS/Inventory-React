import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';

const Textarea = ({ label }) => {
  return (
    <div className="flex gap-3 flex-col">
      <Label>{label}</Label>
      <ShadcnTextarea />
    </div>
  );
};

export default Textarea;
