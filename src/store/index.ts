import { atomWithStorage } from "jotai/utils";

// Global Atoms 
export const colorMode = atomWithStorage("__colorMode", "light")

// Transaction Records -> Holding all the inputted data transaction from user
export const transactionRecords = atomWithStorage("__transactionRecords", "light")
