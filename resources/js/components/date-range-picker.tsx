import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
    value?: DateRange;
    onChange: (value?: DateRange) => void;
    className?: string;
    align?: 'start' | 'center' | 'end';
}

export function DateRangePicker({ value, onChange, className, align = 'start' }: DateRangePickerProps) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button id="date" variant={'outline'} className={cn('justify-start text-left font-normal', !value && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, 'dd MMM yyyy')} - {format(value.to, 'dd MMM yyyy')}
                                </>
                            ) : (
                                format(value.from, 'dd MMM yyyy')
                            )
                        ) : (
                            <span>Filter by date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={align}>
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={onChange}
                        numberOfMonths={2}
                        locale={id}
                        weekStartsOn={1}
                        fixedWeeks
                    />
                    <div className="flex justify-between border-t p-3">
                        <Button variant="outline" size="sm" onClick={() => onChange(undefined)}>
                            Clear
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                                if (value?.from && value?.to) {
                                    // Close popover by simulating ESC key
                                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                                }
                            }}
                            disabled={!value?.from || !value?.to}
                        >
                            Apply
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
