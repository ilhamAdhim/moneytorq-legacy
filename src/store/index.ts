import { ITransaction } from "@/types/transactionTypes";
import { atomWithStorage } from "jotai/utils";

// Global Atoms 
export const colorMode = atomWithStorage<"light" | "dark">("__colorMode", "light")

// Transaction Records -> Holding all the inputted data transaction from user
export const transactionRecords = atomWithStorage<ITransaction[]>("__transactionRecords", [])
