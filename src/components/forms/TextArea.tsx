import React from 'react';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => {
  return (
    <div className="flex gap-3 flex-col">
      <Label>{label}</Label>
      <ShadcnTextarea {...props} />
    </div>
  );
};

export default Textarea;
