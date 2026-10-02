import React from 'react';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  subLabel?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, subLabel, ...props }) => {
  return (
    <div className="flex gap-3 flex-col">
      <Label>{label}<span className="text-gray-400"> ({subLabel})</span></Label>
      <ShadcnTextarea {...props} />
    </div>
  );
};

export default Textarea;
