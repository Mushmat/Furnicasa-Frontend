// src/pages/Policies.jsx
import React from "react";

export default function Policies() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <article className="w-full max-w-4xl bg-white shadow-lg rounded-lg px-8 py-10">
        {/* ───────────────────────── Header ───────────────────────── */}
        <h1 className="text-3xl font-extrabold text-center mb-10">
          Furnicasa — Store Policies
        </h1>

        {/* ─────────────────── Shipping ─────────────────── */}
        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📦</span> Shipping&nbsp;Policy
          </h2>

          <h3 className="font-semibold">Delivery&nbsp;Timelines</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Ready items</strong>&nbsp;(scatter pillows, ready
              lighting): <em>7 – 15&nbsp;days</em>.
            </li>
            <li>
              <strong>Customised products</strong>&nbsp;(sofas, large furniture,
              custom lighting): <em>4 – 6&nbsp;weeks</em>.
            </li>
          </ul>

          <h3 className="font-semibold">Delivery&nbsp;Process</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Deliveries occur <strong>Monday – Saturday</strong>.</li>
            <li>
              Customers receive an <strong>SMS</strong> when the shipment is
              ready for dispatch.
            </li>
            <li>
              Courier partner may call to confirm tentative date &amp; time.
            </li>
            <li>
              Delivery is made to the building&nbsp;premises (ground floor); for
              upper floors customers arrange manpower.
            </li>
          </ul>

          <h3 className="font-semibold">Packaging&nbsp;&amp;&nbsp;Inspection</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Goods are protected with <strong>wooden crates</strong>.
            </li>
            <li>
              Customers must <strong>open &amp; inspect</strong> goods on
              delivery and note issues on the POD.
            </li>
            <li>Delivery staff are not authorised to open crates.</li>
          </ul>

          <h3 className="font-semibold">Delivery&nbsp;Refusals&nbsp;&amp;&nbsp;Charges</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Entryway fit</strong> is the customer’s responsibility.
            </li>
            <li>
              Failed delivery attempts may incur redelivery charges.
            </li>
            <li>
              We don’t deliver to insecure addresses (e.g. PO&nbsp;Boxes).
            </li>
          </ul>

          <h3 className="font-semibold">Exceptional&nbsp;Circumstances</h3>
          <p className="leading-relaxed">
            In rare cases, deliveries may exceed quoted time-frames due to
            weather, strikes or similar events beyond our control.
          </p>
        </section>

        {/* ───────────────── Holding cost ───────────────── */}
        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">🕒</span> Holding Cost /
            Delayed-Delivery&nbsp;Charges
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Free storage for <strong>14&nbsp;days</strong> on written request.
            </li>
            <li>
              Thereafter&nbsp;→ <strong>5 % of order value per month&nbsp;+
              18 % GST</strong>.
            </li>
            <li>Holding fee must be cleared before dispatch.</li>
          </ul>
        </section>

        {/* ───────────────── Warranty ───────────────── */}
        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">🛠️</span> Warranty&nbsp;Information
          </h2>

          <h3 className="font-semibold">Coverage</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>One-year limited warranty</strong> against manufacturing
              defects under normal residential use.
            </li>
            <li>
              Covers imperfections in materials or frames that impair usage.
            </li>
          </ul>

          <h3 className="font-semibold">Exclusions</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Improper storage, handling, assembly or maintenance.</li>
            <li>
              Damage after purchase due to accident, misuse or alterations.
            </li>
            <li>
              Normal wear-and-tear: fabric/leather fading, cushion softening.
            </li>
            <li>Labour or assembly costs.</li>
            <li>Natural variations in colour or grain.</li>
            <li>Commercial use voids the warranty.</li>
          </ul>

          <h3 className="font-semibold">Claims&nbsp;Process</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Email&nbsp;
              <a
                href="mailto:care@furnicasa.in"
                className="text-blue-600 underline"
              >
                care@furnicasa.in
              </a>{" "}
              with proof of purchase.
            </li>
            <li>Warranty is non-transferable.</li>
            <li>
              Furnicasa will repair or replace; cash refunds are not offered.
            </li>
            <li>
              Visible defects must be reported within{" "}
              <strong>7&nbsp;days</strong> of delivery.
            </li>
          </ul>
        </section>

        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Furnicasa. All rights reserved.
        </p>
      </article>
    </div>
  );
}
