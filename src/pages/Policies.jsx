// src/pages/Policies.jsx
import React from "react";
import LegalLayout from "../components/ui/LegalLayout";

const SECTIONS = [
  {
    id: "delivery-timelines",
    title: "Delivery timelines",
    body: (
      <ul>
        <li>
          <strong>Ready items</strong> (scatter pillows, ready lighting):{" "}
          <em>7 – 15 days</em>.
        </li>
        <li>
          <strong>Customised products</strong> (sofas, large furniture, custom
          lighting): <em>4 – 6 weeks</em>.
        </li>
      </ul>
    ),
  },
  {
    id: "delivery-process",
    title: "Delivery process",
    body: (
      <ul>
        <li>
          Deliveries take place <strong>Monday to Saturday</strong>.
        </li>
        <li>
          You'll receive an <strong>SMS</strong> when the shipment is ready for
          dispatch.
        </li>
        <li>
          Our courier partner may call to confirm a tentative date and time.
        </li>
        <li>
          Delivery is made to the building premises (ground floor); for upper
          floors, customers arrange manpower.
        </li>
      </ul>
    ),
  },
  {
    id: "packaging",
    title: "Packaging & inspection",
    body: (
      <ul>
        <li>
          Goods are protected with <strong>wooden crates</strong>.
        </li>
        <li>
          Customers must <strong>open and inspect</strong> goods on delivery and
          note any issues on the proof of delivery.
        </li>
        <li>Delivery staff are not authorised to open crates.</li>
      </ul>
    ),
  },
  {
    id: "refusals",
    title: "Delivery refusals & charges",
    body: (
      <ul>
        <li>
          <strong>Entryway fit</strong> is the customer's responsibility — please
          measure doorways, stairwells and lifts before ordering.
        </li>
        <li>Failed delivery attempts may incur redelivery charges.</li>
        <li>We don't deliver to insecure addresses such as PO boxes.</li>
      </ul>
    ),
  },
  {
    id: "exceptions",
    title: "Exceptional circumstances",
    body: (
      <p>
        In rare cases, deliveries may exceed quoted time-frames due to weather,
        strikes or similar events beyond our control. We'll keep you posted if
        that happens.
      </p>
    ),
  },
  {
    id: "holding",
    title: "Holding cost & delayed delivery",
    body: (
      <ul>
        <li>
          Free storage for <strong>14 days</strong> on written request.
        </li>
        <li>
          Thereafter, <strong>5% of order value per month + 18% GST</strong>{" "}
          applies.
        </li>
        <li>Any holding fee must be cleared before dispatch.</li>
      </ul>
    ),
  },
  {
    id: "warranty-coverage",
    title: "Warranty coverage",
    body: (
      <ul>
        <li>
          <strong>One-year limited warranty</strong> against manufacturing
          defects under normal residential use.
        </li>
        <li>
          Covers imperfections in materials or frames that impair everyday usage.
        </li>
      </ul>
    ),
  },
  {
    id: "warranty-exclusions",
    title: "Warranty exclusions",
    body: (
      <ul>
        <li>Improper storage, handling, assembly or maintenance.</li>
        <li>Damage after purchase due to accident, misuse or alterations.</li>
        <li>
          Normal wear-and-tear: fabric or leather fading, cushion softening.
        </li>
        <li>Labour or assembly costs.</li>
        <li>Natural variations in colour or grain.</li>
        <li>Commercial use, which voids the warranty entirely.</li>
      </ul>
    ),
  },
  {
    id: "claims",
    title: "Claims process",
    body: (
      <ul>
        <li>
          Email <a href="mailto:cc.furnicasa@gmail.com">cc.furnicasa@gmail.com</a>{" "}
          with proof of purchase and photos of the issue.
        </li>
        <li>The warranty is non-transferable.</li>
        <li>
          Furnicasa will repair or replace the affected part; cash refunds are
          not offered.
        </li>
        <li>
          Visible defects must be reported within <strong>7 days</strong> of
          delivery.
        </li>
      </ul>
    ),
  },
];

export default function Policies() {
  return (
    <LegalLayout
      kicker="Good to know"
      title="Store policies"
      subtitle="Shipping, holding and warranty — the details that matter once you've ordered."
      crumbs={[{ label: "Home", to: "/" }, { label: "Policies" }]}
      sections={SECTIONS}
    />
  );
}
