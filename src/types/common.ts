export type COLORS = "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky"

export interface UseDisclosureType{
    isOpen: boolean 
    open: () => void 
    close: () => void 
    toggle: () => void 
}