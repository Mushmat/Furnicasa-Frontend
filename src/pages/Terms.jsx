// src/pages/Terms.jsx
import React from "react";
import { Link } from "react-router-dom";
import LegalLayout from "../components/ui/LegalLayout";

const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    body: (
      <p>
        By accessing <a href="https://www.furnicasa.in">furnicasa.in</a> or
        purchasing from us (the “<strong>Service</strong>”), you agree to be
        bound by these Terms. If you do not accept every provision, please
        refrain from using the Service.
      </p>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: (
      <p>
        You must be at least the age of majority in your state or province of
        residence and legally capable of entering contracts. The Service may not
        be used for any unlawful purpose.
      </p>
    ),
  },
  {
    id: "products",
    title: "Products and pricing",
    body: (
      <ul>
        <li>
          All products are displayed subject to availability; images are for
          illustration only, and colours may vary slightly.
        </li>
        <li>
          Prices are listed in Indian Rupees (INR) and include GST unless stated
          otherwise. We reserve the right to change prices or discontinue items
          without notice.
        </li>
        <li>
          Inaccuracies (typographical or system errors) may be corrected, and
          your order amended or cancelled accordingly.
        </li>
      </ul>
    ),
  },
  {
    id: "orders",
    title: "Orders and payment",
    body: (
      <ul>
        <li>
          When you submit an order it is an <em>offer</em> to purchase. Furnicasa
          reserves the right to accept or reject that offer.
        </li>
        <li>
          Payment gateways (Razorpay, UPI, net-banking, credit and debit cards)
          process your transaction; Furnicasa never stores full card details.
        </li>
        <li>
          Orders are considered confirmed only after full payment — or an agreed
          milestone payment — is received.
        </li>
      </ul>
    ),
  },
  {
    id: "cancellations",
    title: "Cancellations & changes",
    body: (
      <ul>
        <li>
          <strong>Made-to-order furniture</strong> may be cancelled within 24
          hours of payment. After that, a 30% fabrication charge applies.
        </li>
        <li>
          Ready items may be cancelled (by contacting us) until they leave our
          warehouse.
        </li>
        <li>
          To request a change or cancellation, email{" "}
          <a href="mailto:cc.furnicasa@gmail.com">cc.furnicasa@gmail.com</a>{" "}
          quoting your order ID.
        </li>
      </ul>
    ),
  },
  {
    id: "shipping",
    title: "Shipping, holding & warranty",
    body: (
      <p>
        Full details are provided in our{" "}
        <Link to="/policies">store policies</Link>, which form an integral part
        of these Terms.
      </p>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <p>
        All content — logos, photos, text, graphics and layouts — is the
        exclusive property of Furnicasa or its licensors and is protected by
        Indian and international copyright law. Reproduction or distribution
        without written consent is prohibited.
      </p>
    ),
  },
  {
    id: "ugc",
    title: "Reviews & other user content",
    body: (
      <ul>
        <li>
          By submitting a review you grant Furnicasa a non-exclusive,
          royalty-free, perpetual licence to use, modify, display and distribute
          that content across any marketing channel.
        </li>
        <li>
          Furnicasa may remove content that is defamatory, obscene, infringing or
          irrelevant at its sole discretion.
        </li>
      </ul>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        To the maximum extent permitted by law, Furnicasa, its directors,
        employees and affiliates shall not be liable for any indirect,
        incidental or consequential damages arising from the Service, even if
        advised of the possibility of such damages.
      </p>
    ),
  },
  {
    id: "indemnify",
    title: "Indemnification",
    body: (
      <p>
        You agree to indemnify and hold Furnicasa harmless from any claim or
        demand, including reasonable attorneys' fees, arising out of your breach
        of these Terms or violation of any law or third-party rights.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    body: (
      <p>
        Our handling of personal data is described in the{" "}
        <Link to="/privacy">Furnicasa privacy notice</Link>. By using the Service
        you consent to that processing.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law & dispute resolution",
    body: (
      <p>
        These Terms are governed by the laws of India. Any dispute shall be
        subject to the exclusive jurisdiction of the courts of Jaipur,
        Rajasthan. You agree to attempt informal resolution with Furnicasa for at
        least 30 days before filing suit.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        Furnicasa may modify these Terms at any time by posting the updated
        version on the site. Continued use of the Service constitutes acceptance
        of the revised Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions? Email{" "}
        <a href="mailto:cc.furnicasa@gmail.com">cc.furnicasa@gmail.com</a> or
        write to Furnicasa, C-193, Riico Residential Colony, Sitapura, Jaipur
        302022, India.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Terms & conditions"
      subtitle="The agreement between you and Furnicasa when you browse or buy."
      updated={new Date(2025, 4, 24).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
      crumbs={[{ label: "Home", to: "/" }, { label: "Terms" }]}
      sections={SECTIONS}
    />
  );
}
