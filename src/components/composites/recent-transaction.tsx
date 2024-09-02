"use client";

import { useAtomValue } from "jotai/react";
import { transactionRecords } from "@/store";
import { ITransaction } from "@/types/transaction";

export function RecentTransaction() {
  const recentTransaction = useAtomValue(transactionRecords);

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$1,999.00</div>
      </div>
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$1,999.00</div>
      </div>

      {recentTransaction.map((item: ITransaction) => (
        <div key={item.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            ``
            <p className="text-sm font-medium leading-none">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div
            className={`ml-auto font-medium ${
              item.transaction_type === "income" ? "text-green" : "text-danger"
            }`}
          >
            {" "}
            {item.amount}{" "}
          </div>
        </div>
      ))}
    </div>
  );
}
