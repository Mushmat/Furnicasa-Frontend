// src/pages/Privacy.jsx
import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <article className="w-full max-w-5xl bg-white shadow-lg rounded-lg px-8 py-10 prose prose-sm sm:prose-base">
        {/* ─────────── Title ─────────── */}
        <h1 className="text-center">Furnicasa — Privacy&nbsp;Policy</h1>
        <p className="text-center text-xs text-gray-500">
          Last updated&nbsp;· {new Date().toLocaleDateString()}
        </p>

        {/* ─────────── 1. Introduction ─────────── */}
        <h2>1. Introduction</h2>
        <p>
          Furnicasa (“<strong>we</strong>”, “<strong>us</strong>”, “
          <strong>our</strong>”) respects your privacy. This Privacy Policy
          explains how we collect, use, disclose and safeguard your information
          when you visit <a href="https://www.furnicasa.in">furnicasa.in</a> or
          interact with our services (“<strong>Site</strong>”).
        </p>

        {/* ─────────── 2. Information We Collect ─────────── */}
        <h2>2. Information&nbsp;We&nbsp;Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Information you provide</strong>: name, postal address,
            phone number, email, payment details, reviews or messages.
          </li>
          <li>
            <strong>Automatic data</strong>: IP address, browser type, device
            identifiers, referring URLs, pages visited, time spent.
          </li>
          <li>
            <strong>Cookies &amp; similar tech</strong>: small files that store
            preferences and help us understand usage patterns.
          </li>
        </ul>

        {/* ─────────── 3. How We Use Data ─────────── */}
        <h2>3. How&nbsp;We&nbsp;Use&nbsp;Your&nbsp;Data</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Process and deliver your orders;</li>
          <li>Respond to enquiries and provide customer support;</li>
          <li>Send service-related messages (order updates, policy changes);</li>
          <li>Improve our products, services and Site experience;</li>
          <li>Show personalised offers or advertising (with consent);</li>
          <li>Detect and prevent fraud or security incidents;</li>
          <li>
            Comply with legal obligations and enforce our{" "}
            <a href="/terms" className="underline">
              Terms &amp; Conditions
            </a>
            .
          </li>
        </ul>

        {/* ─────────── 4. Cookies ─────────── */}
        <h2>4. Cookies&nbsp;and&nbsp;Tracking</h2>
        <p>
          We use first-party cookies (for cart, login session) and
          third-party cookies (analytics, ads). You may disable cookies in your
          browser, but parts of the Site may not function properly.
        </p>

        {/* ─────────── 5. Sharing ─────────── */}
        <h2>5. Sharing&nbsp;of&nbsp;Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Service providers</strong>: logistics, payment gateways,
            analytics—only what they need to perform their task.
          </li>
          <li>
            <strong>Legal</strong>: when required by law or to protect our
            rights.
          </li>
          <li>
            <strong>Business transfers</strong>: in connection with a merger,
            acquisition or sale of assets.
          </li>
          <li>
            We never sell or rent your personal data for profit.
          </li>
        </ul>

        {/* ─────────── 6. Data Retention ─────────── */}
        <h2>6. Data&nbsp;Retention</h2>
        <p>
          We keep your information for as long as necessary to fulfil the
          purposes outlined above, unless a longer retention period is required
          by law (e.g.&nbsp;tax records).
        </p>

        {/* ─────────── 7. Security ─────────── */}
        <h2>7. Security</h2>
        <p>
          Furnicasa uses industry-standard safeguards—encryption, access
          controls, secure servers—to protect your data. No system is
          completely fool-proof; you share information at your own risk.
        </p>

        {/* ─────────── 8. Your Rights ─────────── */}
        <h2>8. Your&nbsp;Choices&nbsp;and&nbsp;Rights</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Access, correct or delete your personal information;</li>
          <li>Object to processing or request data portability;</li>
          <li>
            Opt-out of marketing emails by clicking “unsubscribe” or emailing
            us;
          </li>
          <li>
            Disable cookies via browser settings (may affect functionality).
          </li>
        </ul>

        {/* ─────────── 9. International Transfers ─────────── */}
        <h2>9. International&nbsp;Transfers</h2>
        <p>
          We may transfer your information to servers outside your country.
          Where required, we rely on contractual clauses or other safeguards to
          protect such data.
        </p>

        {/* ─────────── 10. Children --------- */}
        <h2>10. Children’s&nbsp;Privacy</h2>
        <p>
          The Site is not directed to children under 13. We do not knowingly
          collect personal information from children. If you believe a child has
          provided us data, please contact us to delete it.
        </p>

        {/* ─────────── 11. Changes --------- */}
        <h2>11. Changes&nbsp;to&nbsp;This&nbsp;Policy</h2>
        <p>
          We may update this Policy occasionally. Material changes will be
          notified via email or Site banner. Continued use of the Site after
          updates constitutes acceptance of the revised Policy.
        </p>

        {/* ─────────── 12. Contact --------- */}
        <h2>12. Contact&nbsp;Us</h2>
        <p>
          For privacy questions or requests, email&nbsp;
          <a href="mailto:cc.furnicasa@gmail.com" className="underline">
            cc.furnicasa@gmail.com
          </a>
          &nbsp;or write to&nbsp;Furnicasa, C-&nbsp;193, Riico&nbsp;Residential&nbsp;Colony,
          Sitapura, Jaipur 302022, India.
        </p>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Furnicasa. All rights reserved.
        </p>
      </article>
    </div>
  );
}
