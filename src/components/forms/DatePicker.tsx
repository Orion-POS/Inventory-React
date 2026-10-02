import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormControl, FormItem, FormMessage } from '../ui/form';
import { useState } from 'react';
import dayjs from 'dayjs';

const DatePicker = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <FormItem className="mt-2">
      <FormControl>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              onClick={() => setPopoverOpen(!popoverOpen)}
              className={cn(
                'w-full justify-start font-normal',
                !date && 'text-muted-foreground'
              )}>
            {date ? dayjs(date).format('DD/MM/YYYY') : null}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={day => {
                if (day && day !== date) {
                  setDate(day);
                  setPopoverOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default DatePicker;
