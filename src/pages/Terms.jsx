// src/pages/Terms.jsx
import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <article className="w-full max-w-5xl bg-white shadow-lg rounded-lg px-8 py-10 prose prose-sm sm:prose-base">
        {/* ─────────── Header ─────────── */}
        <h1 className="text-center">
          Furnicasa — Terms&nbsp;&amp;&nbsp;Conditions
        </h1>
        <p className="text-center text-xs text-gray-500">
          Last updated&nbsp;· {new Date(2025, 4, 24).toLocaleDateString()}
        </p>

        {/* ─────────── 1. Acceptance ─────────── */}
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing <a href="https://www.furnicasa.in">furnicasa.in</a> or
          purchasing from us (“<strong>Service</strong>”), you agree to be bound
          by these Terms. If you do not accept all provisions, do not use the
          Service.
        </p>

        {/* ─────────── 2. Eligibility ─────────── */}
        <h2>2. Eligibility</h2>
        <p>
          You must be at least the age of majority in your state or province of
          residence and legally capable of entering contracts. You may not use
          the Service for any unlawful purpose.
        </p>

        {/* ─────────── 3. Products & Prices ─────────── */}
        <h2>3. Products&nbsp;and&nbsp;Pricing</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            All products are displayed subject to availability; images are for
            illustration only and colours may vary slightly.
          </li>
          <li>
            Prices are listed in Indian Rupees (INR) and include GST unless
            stated otherwise. We reserve the right to change prices or discontinue items without notice.
          </li>
          <li>
            Inaccuracies (typographical or system errors) may be corrected and
            your order amended or cancelled accordingly.
          </li>
        </ul>

        {/* ─────────── 4. Orders & Payment ─────────── */}
        <h2>4. Orders&nbsp;and&nbsp;Payment</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            When you submit an order, it is an <em>offer</em> to purchase.
            Furnicasa reserves the right to accept or reject the offer.
          </li>
          <li>
            Payment gateways (Razorpay, UPI, net-banking, credit/debit cards)
            process your transaction; we do not store full card details.
          </li>
          <li>
            Orders are considered confirmed only after full payment (or agreed
            milestone payment) is received.
          </li>
        </ul>

        {/* ─────────── 5. Cancellations ─────────── */}
        <h2>5. Cancellations &amp; Changes</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Made-to-order furniture:</strong> Can be cancelled within
            24 hours of payment. After that, a 30 % fabrication charge applies.
          </li>
          <li>
            Ready items may be cancelled until they are dispatched from our
            warehouse.
          </li>
          <li>
            To request a change or cancellation, email&nbsp;
            <a href="mailto:care@furnicasa.in" className="underline">
              care@furnicasa.in
            </a>{" "}
            quoting your order ID.
          </li>
        </ul>

        {/* ─────────── 6. Shipping, Holding, Warranty ─────────── */}
        <h2>6. Shipping, Holding &amp; Warranty</h2>
        <p>
          These topics are covered in detail in our{" "}
          <LinkWithUnderline to="/policies">Store&nbsp;Policies</LinkWithUnderline>. They form part of these
          Terms.
        </p>

        {/* ─────────── 7. Intellectual-Property ─────────── */}
        <h2>7. Intellectual&nbsp;Property</h2>
        <p>
          All content—logos, photos, text, graphics, and layouts—is the
          exclusive property of Furnicasa or its licensors and protected by
          Indian and international copyright laws. You may not reproduce,
          distribute or exploit any part without prior written consent.
        </p>

        {/* ─────────── 8. User-Generated Content ─────────── */}
        <h2>8. Reviews &amp; Other User Content</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            By submitting a review, you grant Furnicasa a non-exclusive,
            royalty-free, perpetual licence to use, modify, display and
            distribute that content on any marketing channel.
          </li>
          <li>
            We may remove content that is defamatory, obscene, infringing or
            irrelevant, at our sole discretion.
          </li>
        </ul>

        {/* ─────────── 9. Limitation of Liability ─────────── */}
        <h2>9. Limitation&nbsp;of&nbsp;Liability</h2>
        <p>
          To the maximum extent permitted by law, Furnicasa, its directors,
          employees and affiliates shall not be liable for any indirect,
          incidental or consequential damages arising out of or related to the
          Service, even if advised of the possibility of such damages.
        </p>

        {/* ─────────── 10. Indemnification ─────────── */}
        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify and hold Furnicasa harmless from any claim or
          demand, including reasonable attorneys’ fees, arising out of your
          breach of these Terms or violation of any law or third-party rights.
        </p>

        {/* ─────────── 11. Privacy ─────────── */}
        <h2>11. Privacy</h2>
        <p>
          Our handling of personal data is explained in the{" "}
          <LinkWithUnderline to="/privacy">
            Furnicasa Privacy Notice
          </LinkWithUnderline>. By using the Service you consent to that
          processing.
        </p>

        {/* ─────────── 12. Governing-Law & Disputes ─────────── */}
        <h2>12. Governing Law &amp; Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of India. Any dispute shall be
          subject to the exclusive jurisdiction of the courts of Bangalore,
          Karnataka. You agree to attempt informal resolution with Furnicasa for
          at least 30 days before filing suit.
        </p>

        {/* ─────────── 13. Changes ─────────── */}
        <h2>13. Changes to Terms</h2>
        <p>
          Furnicasa may modify these Terms at any time by posting the updated
          version on the Site. Continued use of the Service constitutes
          acceptance of the revised Terms.
        </p>

        {/* ─────────── 14. Contact ─────────── */}
        <h2>14. Contact</h2>
        <p>
          Questions? Email&nbsp;
          <a href="mailto:care@furnicasa.in" className="underline">
            care@furnicasa.in
          </a>
          &nbsp;or write to&nbsp;Furnicasa, No.&nbsp;21, 4th&nbsp;Cross,
          HSR&nbsp;Layout, Bangalore 560102, India.
        </p>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Furnicasa. All rights reserved.
        </p>
      </article>
    </div>
  );
}

/* simple helper so Tailwind keeps link styling even in prose */
const LinkWithUnderline = ({ to, children }) => (
  <a href={to} className="text-blue-600 underline">
    {children}
  </a>
);
