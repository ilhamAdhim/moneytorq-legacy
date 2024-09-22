import { COLORS_OPTION } from "@/constants";
import { ICategory } from "@/types/category";
import { ITransaction } from "@/types/transaction";
import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";

// Global Atoms
export const colorMode = atomWithStorage<"light" | "dark" | "system">("__colorMode", "system");

// Transaction Records -> Holding all the inputted data transaction from user
export const transactionRecords = atomWithStorage<ITransaction[]>("__transactionRecords", []);

export const categories = atomWithStorage<ICategory[]>("__categories", [
  {
    id: 0,
    category_title: "Transportation",
    colorBadge: "cyan",
  },
]);

export const PROCESSED_COLORS_ATOM = atom(
  COLORS_OPTION.map(item => {
    return {
      value: item,
      label: item,
    };
  })
);
