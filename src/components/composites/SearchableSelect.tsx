// ? This component is derived from Combo Box ShadCN
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ICategory } from "@/types/category";
import { Dispatch, SetStateAction } from "react";
import { COLORS } from "@/types/common";

interface ISearchableSelect {
  data: ICategory[] | any[];
  selectedValue: string;
  setSelectedValue: Dispatch<SetStateAction<any>>;
  entity: string;
  keyIdentifierValue?: "value" | string;
}

export function SearchableSelect({
  data,
  entity,
  selectedValue,
  setSelectedValue,
  keyIdentifierValue = "value",
}: ISearchableSelect) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue
            ? data.find(item => item[keyIdentifierValue] === selectedValue)?.label
            : `Select ${entity}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${entity}...`} />
          <CommandEmpty>No {entity} found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {data.map(item => (
                <CommandItem
                  className="color-red"
                  key={item[keyIdentifierValue]}
                  value={item[keyIdentifierValue]}
                  onSelect={currentValue => {
                    setSelectedValue(currentValue === selectedValue ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === item[keyIdentifierValue] ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className={`bg-red`}>{item.label}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
