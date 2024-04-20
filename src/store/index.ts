import { ITransaction } from "@/types/transactionTypes";
import { atomWithStorage } from "jotai/utils";

// Global Atoms 
export const colorMode = atomWithStorage<"light" | "dark" | "system">("__colorMode", "system")

// Transaction Records -> Holding all the inputted data transaction from user
export const transactionRecords = atomWithStorage<ITransaction[]>("__transactionRecords", [])
