// src/pages/FAQs.jsx
import React from "react";

export default function FAQs() {
  const faqs = [
    {
      q: "How long will my order take to arrive?",
      a: (
        <>
          <p>
            <strong>Ready items</strong> such as scatter pillows or in-stock
            lighting reach you within <em>7 – 15&nbsp;days</em>. Custom-built
            pieces (sofas, large furniture, bespoke lighting) require{" "}
            <em>4 – 6&nbsp;weeks</em> from order confirmation.
          </p>
        </>
      ),
    },
    {
      q: "Do you charge for delivery?",
      a: (
        <p>
          Standard curb-side delivery is <strong>free across India</strong>. If
          your building requires additional manpower (for floors above ground
          that lack a service lift) you can either arrange helpers yourself or
          ask us for a separate quotation.
        </p>
      ),
    },
    {
      q: "What if my doorway or lift is too small?",
      a: (
        <p>
          Please double-check measurements before ordering. Entryway fit is the
          customer’s responsibility; we cannot refund or replace items that
          cannot pass through your doors, stairwells or lifts.
        </p>
      ),
    },
    {
      q: "Can you store my order until my new home is ready?",
      a: (
        <>
          <p>
            Yes — we’ll hold orders in our warehouse <strong>free for 14 days</strong> after
            the scheduled dispatch date. Beyond that, holding fees apply at{" "}
            <strong>5 % of the order value per month + 18 % GST</strong>.
          </p>
        </>
      ),
    },
    {
      q: "What does the one-year warranty cover?",
      a: (
        <ul className="list-disc list-inside space-y-1">
          <li>Manufacturing defects in frames and construction.</li>
          <li>
            Material imperfections that affect normal residential use.
          </li>
          <li>
            We will repair or replace the affected part at our discretion.
          </li>
        </ul>
      ),
    },
    {
      q: "What is <em>not</em> covered by the warranty?",
      a: (
        <ul className="list-disc list-inside space-y-1">
          <li>Natural wear-and-tear, fading, or cushion softening.</li>
          <li>Damage from misuse, accidents, improper assembly or storage.</li>
          <li>Labour/installation costs and commercial-use damage.</li>
          <li>
            Fabric / leather themselves (except for transit damage reported
            within 2 days).
          </li>
        </ul>
      ),
    },
    {
      q: "How do I raise a warranty claim?",
      a: (
        <p>
          Email&nbsp;
          <a
            href="mailto:cc.furnicasa@gmail.com"
            className="text-blue-600 underline"
          >
            cc.furnicasa@gmail.com
          </a>{" "}
          along with your order ID, photos of the issue and a brief description.
          Claims for visible defects must be lodged within <strong>7 days</strong> of
          delivery.
        </p>
      ),
    },
    {
      q: "Can I track my shipment?",
      a: (
        <p>
          Absolutely. Once your order leaves our warehouse you’ll receive an SMS
          with the tracking link and the courier’s contact details.
        </p>
      ),
    },
    {
      q: "Do you accept returns?",
      a: (
        <p>
          Because each piece is custom-built to order, we cannot accept
          change-of-mind returns. If your item arrives damaged or defective,
          contact us within 48 hours and we’ll arrange repair or replacement
          under warranty.
        </p>
      ),
    },
    {
      q: "How can I leave a product review?",
      a: (
        <p>
          Log in, open the product page and scroll to
          <strong> “Customer Reviews”</strong>. Choose a star rating (5&nbsp;=
          Excellent, 1&nbsp;= Poor) and add your comments. Reviews help other
          shoppers and can only be submitted by verified purchasers.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg px-8 py-10">
        <h1 className="text-3xl font-extrabold text-center mb-10">FAQs</h1>

        <div className="space-y-6">
          {faqs.map(({ q, a }, idx) => (
            <details
              key={idx}
              className="border rounded-lg p-4 [&_summary]:cursor-pointer"
            >
              <summary className="font-semibold">
                {idx + 1}. {q}
              </summary>
              <div className="mt-2 text-sm leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
