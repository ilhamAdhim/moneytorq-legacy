"use client";

import { useAtomValue } from "jotai/react";
import { transactionRecords } from "@/store";
import { ITransaction } from "@/types/transaction";
import { formatRupiah } from "@/utils/common";
import { format } from "date-fns";

interface IRecentTransactionView {
  data: ITransaction[];
}

export function RecentTransaction({ data }: IRecentTransactionView) {
  return (
    <div className="space-y-8">
      {data.length > 0 ? (
        data?.map((item: ITransaction) => (
          <div key={item.id} className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item.title}</p>
              <p className="text-sm text-muted-foreground">{format(item.date, "dd MMM yyyy")}</p>
            </div>
            <div
              className={`ml-auto font-medium ${
                item.transaction_type === "income" ? "text-green-500" : "text-red-500"
              }`}
            >
              {formatRupiah(item.amount)}
            </div>
          </div>
        ))
      ) : (
        <div className="w-full text-center">Data Kosong</div>
      )}
    </div>
  );
}
