// src/components/OrderTimeline.jsx
import React from "react";

const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
const ETA_DAYS = { Shipped: 13, Delivered: 21 };

export default function OrderTimeline({ status, placedDate }) {
  if (status === "Cancelled")
    return <p className="text-red-600 font-semibold mt-4">Order Cancelled</p>;

  const current = steps.findIndex(s => s.toLowerCase() === status.toLowerCase());

  const addDays = (dateStr, n) =>
    new Date(new Date(dateStr).getTime() + n * 86400000)
      .toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  return (
    <div className="mt-6 flex items-center justify-between gap-2 overflow-x-auto">
      {steps.map((step, i) => {
        const done = i <= current;
        const eta = step === "Order Placed"
          ? new Date(placedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
          : addDays(placedDate, ETA_DAYS[step] ?? ETA_DAYS.Delivered - 1);

        return (
          <div key={step} className="flex-1 min-w-[70px] text-center">
            <div className={`mx-auto w-4 h-4 rounded-full ${done ? "bg-green-600" : "bg-gray-300"}`} />
            <p className={`text-xs mt-1 ${done ? "text-green-600" : "text-gray-500"}`}>
              {step}
            </p>
            {step !== "Order Placed" && (
              <p className="text-[11px] text-gray-400">{eta}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
