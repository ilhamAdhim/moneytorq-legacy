"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Controller, UseFormReturn } from "react-hook-form";

interface IDatePicker {
  useFormAttributes: UseFormReturn;
}

export function DatePicker({ useFormAttributes }: IDatePicker) {
  return (
    <Controller
      name="date"
      rules={{
        required: {
          message: "Please pick transaction date",
          value: true,
        },
      }}
      control={useFormAttributes.control as any}
      render={({ field }) => {
        console.log("field", field.value);
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={date => date > new Date() || date < new Date("1900-01-01")}
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
