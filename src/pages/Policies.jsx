// src/pages/Policies.jsx
import React from "react";

export default function Policies() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <article className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 prose prose-sm sm:prose-base">
        <h1 className="text-center">Furnicasa — Store Policies</h1>

        {/* ─────────────────── Shipping ─────────────────── */}
        <h2>📦 Shipping Policy</h2>

        <h3>Delivery Timelines</h3>
        <ul>
          <li>
            <strong>Ready items</strong> (scatter pillows, ready lighting):&nbsp;
            <em>7 – 15&nbsp;days</em>.
          </li>
          <li>
            <strong>Customised products</strong> (sofas, large furniture, custom
            lighting):&nbsp;
            <em>4 – 6&nbsp;weeks</em>.
          </li>
        </ul>

        <h3>Delivery Process</h3>
        <ul>
          <li>Deliveries occur <strong>Monday – Saturday</strong>.</li>
          <li>
            Customers receive an <strong>SMS</strong> when the shipment is ready
            for dispatch.
          </li>
          <li>
            Our courier partner may call to confirm the tentative delivery date
            and time.
          </li>
          <li>
            Delivery is made to the building premises (or wherever physically
            possible). For floors above the first, customers must arrange their
            own manpower.
          </li>
        </ul>

        <h3>Packaging & Inspection</h3>
        <ul>
          <li>
            Goods are protected with <strong>wooden crates</strong>; packaging
            may therefore be bulky.
          </li>
          <li>
            Customers must <strong>open & inspect</strong> goods on delivery.{" "}
            Report any defect or damage to both the delivery person
            <em>and</em> Furnicasa customer care and note it on the Proof of
            Delivery (POD).
          </li>
          <li>
            Delivery personnel are <em>not</em> authorised to open packages or
            crates.
          </li>
        </ul>

        <h3>Delivery Refusals & Charges</h3>
        <ul>
          <li>
            <strong>Entryway fit</strong> is the customer’s responsibility; we
            cannot refund/replace items that do not fit through doors, lifts or
            stairwells.
          </li>
          <li>
            Failed delivery attempts (size issues, no-show, wrong address) may
            incur additional charges for redelivery.
          </li>
          <li>
            Furnicasa reserves the right not to deliver to insecure addresses
            (e.g.&nbsp;communal post boxes or PO Boxes).
          </li>
        </ul>

        <h3>Exceptional Circumstances</h3>
        <p>
          In rare cases, deliveries may fall outside the quoted time-frames due
          to events beyond our control (weather, strikes, etc.).
        </p>

        {/* ───────────────── Holding cost ───────────────── */}
        <h2>🕒 Holding Cost / Delayed-Delivery Charges</h2>
        <ul>
          <li>
            We offer a <strong>2-week grace period</strong> to hold orders in
            our warehouse upon request.
          </li>
          <li>
            After that, a holding fee of{" "}
            <strong>5 % of the order value per month&nbsp;+ 18 % GST</strong>{" "}
            applies (partial orders included).
          </li>
          <li>Holding fees must be cleared before dispatch.</li>
        </ul>

        {/* ───────────────── Warranty ───────────────── */}
        <h2>🛠️ Warranty Information</h2>

        <h3>Coverage</h3>
        <ul>
          <li>
            <strong>One-year limited warranty</strong> against manufacturing
            defects when used under normal residential conditions.
          </li>
          <li>
            Applies to imperfections in materials or wooden frames that impair
            usage.
          </li>
        </ul>

        <h3>Exclusions</h3>
        <ul>
          <li>Improper storage, handling, assembly or maintenance.</li>
          <li>
            Damage after purchase due to modifications, misuse, accidents or
            negligence.
          </li>
          <li>Normal wear-and-tear: fabric/leather fading, cushion softening.</li>
          <li>Labour/assembly costs.</li>
          <li>Natural colour or texture variations in fabric, leather or wood.</li>
          <li>Fabric and leather themselves are not covered.</li>
          <li>Commercial use voids the warranty.</li>
        </ul>

        <h3>Claims Process</h3>
        <ul>
          <li>
            Report defects within the warranty period to{" "}
            <a href="mailto:care@furnicasa.in">care@furnicasa.in</a>.
          </li>
          <li>
            Proof of purchase is required. Warranty is non-transferable and
            limited to the original purchaser.
          </li>
          <li>
            Furnicasa will repair or replace the item (of equal value). No cash
            refunds.
          </li>
          <li>
            Lighting: warranty covers non-electrical defects only. Filament
            bulbs are covered <em>only</em> if reported broken/non-working
            within&nbsp;2 days of delivery.
          </li>
          <li>
            Visible defects must be reported within <strong>7 days</strong> of
            delivery; issues reported later are deemed acceptable.
          </li>
        </ul>

        <p className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Furnicasa. All rights reserved.
        </p>
      </article>
    </div>
  );
}
