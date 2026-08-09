// src/pages/Privacy.jsx
import React from "react";
import { Link } from "react-router-dom";
import LegalLayout from "../components/ui/LegalLayout";

const SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <p>
        Furnicasa (“<strong>we</strong>”, “<strong>us</strong>”, “
        <strong>our</strong>”) respects your privacy. This policy explains how we
        collect, use, disclose and safeguard your information when you visit{" "}
        <a href="https://www.furnicasa.in">furnicasa.in</a> or interact with our
        services (the “<strong>Site</strong>”).
      </p>
    ),
  },
  {
    id: "collect",
    title: "Information we collect",
    body: (
      <ul>
        <li>
          <strong>Information you provide</strong>: name, postal address, phone
          number, email, payment details, reviews or messages.
        </li>
        <li>
          <strong>Automatic data</strong>: IP address, browser type, device
          identifiers, referring URLs, pages visited and time spent.
        </li>
        <li>
          <strong>Cookies and similar tech</strong>: small files that store
          preferences and help us understand usage patterns.
        </li>
      </ul>
    ),
  },
  {
    id: "use",
    title: "How we use your data",
    body: (
      <ul>
        <li>Process and deliver your orders.</li>
        <li>Respond to enquiries and provide customer support.</li>
        <li>Send service-related messages such as order updates.</li>
        <li>Improve our products, services and site experience.</li>
        <li>Show personalised offers or advertising, with your consent.</li>
        <li>Detect and prevent fraud or security incidents.</li>
        <li>
          Comply with legal obligations and enforce our{" "}
          <Link to="/terms">terms &amp; conditions</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and tracking",
    body: (
      <p>
        We use first-party cookies (for your cart and login session) and
        third-party cookies (analytics, ads). You may disable cookies in your
        browser, but parts of the Site may not function properly.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Sharing of information",
    body: (
      <ul>
        <li>
          <strong>Service providers</strong>: logistics, payment gateways and
          analytics — only what they need to perform their task.
        </li>
        <li>
          <strong>Legal</strong>: when required by law or to protect our rights.
        </li>
        <li>
          <strong>Business transfers</strong>: in connection with a merger,
          acquisition or sale of assets.
        </li>
        <li>We never sell or rent your personal data for profit.</li>
      </ul>
    ),
  },
  {
    id: "retention",
    title: "Data retention",
    body: (
      <p>
        We keep your information for as long as necessary to fulfil the purposes
        outlined above, unless a longer retention period is required by law — for
        example, tax records.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        Furnicasa uses industry-standard safeguards — encryption, access controls
        and secure servers — to protect your data. No system is completely
        fool-proof; you share information at your own risk.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your choices and rights",
    body: (
      <ul>
        <li>Access, correct or delete your personal information.</li>
        <li>Object to processing or request data portability.</li>
        <li>
          Opt out of marketing emails by clicking “unsubscribe” or emailing us.
        </li>
        <li>
          Disable cookies via your browser settings, which may affect
          functionality.
        </li>
      </ul>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        We may transfer your information to servers outside your country. Where
        required, we rely on contractual clauses or other safeguards to protect
        that data.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children's privacy",
    body: (
      <p>
        The Site is not directed to children under 13 and we do not knowingly
        collect personal information from them. If you believe a child has
        provided us data, please contact us and we'll delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy occasionally. Material changes will be notified
        by email or a site banner. Continued use of the Site after updates
        constitutes acceptance of the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        For privacy questions or requests, email{" "}
        <a href="mailto:cc.furnicasa@gmail.com">cc.furnicasa@gmail.com</a> or
        write to Furnicasa, C-193, Riico Residential Colony, Sitapura, Jaipur
        302022, India.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Privacy policy"
      subtitle="What we collect, why we collect it, and the control you keep over it."
      updated={new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
      crumbs={[{ label: "Home", to: "/" }, { label: "Privacy" }]}
      sections={SECTIONS}
    />
  );
}
