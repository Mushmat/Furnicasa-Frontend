// src/components/OrderTimeline.jsx
import React from "react";

const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
const ETA_DAYS = { Shipped: 13, Delivered: 21 };

export default function OrderTimeline({ status, placedDate }) {
  if (status === "Cancelled") {
    return <p className="text-red-600 font-semibold mt-4">Order Cancelled</p>;
  }

  // find current step index
  const current = steps.findIndex(
    (s) => s.toLowerCase() === status.toLowerCase()
  );

  // helper to add days and format
  const addDays = (dateStr, n) =>
    new Date(new Date(dateStr).getTime() + n * 86400000).toLocaleDateString(
      "en-IN",
      { day: "2-digit", month: "short" }
    );

  // compute ETAs array in same order as steps
  const etas = steps.map((step) =>
    step === "Order Placed"
      ? new Date(placedDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })
      : addDays(placedDate, ETA_DAYS[step] ?? ETA_DAYS.Delivered - 1)
  );

  return (
    <div className="mt-6 space-y-2">
      {/* Row of circles + connectors */}
      <div className="flex items-center">
        {steps.map((step, i) => {
          const done = i === 0 || i<= current;
          return (
            <React.Fragment key={step}>
              <div
                className={`w-4 h-4 rounded-full ${
                  done ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    i < current ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Row of labels */}
      <div className="flex justify-between text-xs">
        {steps.map((step, i) => {
          const done = i <= current;
          return (
            <div key={step} className="flex-1 text-center">
              <p className={done ? "text-green-600" : "text-gray-500"}>
                {step}
              </p>
            </div>
          );
        })}
      </div>

      {/* Row of ETAs (skip first) */}
      <div className="flex justify-between text-[11px] text-gray-400">
        {etas.map((eta, i) => (
          <div key={i} className="flex-1 text-center">
            {i === 0 ? "" : eta}
          </div>
        ))}
      </div>
    </div>
  );
}
