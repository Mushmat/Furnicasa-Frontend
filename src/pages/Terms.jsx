// src/pages/Terms.jsx
import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <article
        className="
          w-full max-w-5xl
          bg-white shadow-lg rounded-lg
          px-8 py-10
          prose prose-sm sm:prose-base lg:prose-lg
          space-y-6
          prose-headings:font-extrabold prose-headings:text-gray-900
          prose-h2:mt-8
          prose-ul:pl-6 prose-ul:marker:text-orange-600
        "
      >
        {/* ─────────── Header ─────────── */}
        <h1 className="text-center font-extrabold">
          Furnicasa — Terms&nbsp;&amp;&nbsp;Conditions
        </h1>
        <p className="text-center text-xs text-gray-500">
          Last&nbsp;updated&nbsp;– {new Date(2025, 4, 24).toLocaleDateString()}
        </p>

        <ol className="list-decimal list-inside space-y-6">

          {/* 1. Acceptance */}
          <li id="acceptance">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing <a href="https://www.furnicasa.in">furnicasa.in</a> or purchasing
              from us (“<strong>Service</strong>”), you agree to be bound by these
              Terms. If you do not accept every provision, please refrain from
              using the Service.
            </p>
          </li>

          {/* 2. Eligibility */}
          <li id="eligibility">
            <h2>Eligibility</h2>
            <p>
              You must be at least the age of majority in your state or province
              of residence and legally capable of entering contracts. The Service
              may not be used for any unlawful purpose.
            </p>
          </li>

          {/* 3. Products & Pricing */}
          <li id="products">
            <h2>Products&nbsp;and&nbsp;Pricing</h2>
            <ul className="space-y-1">
              <li>
                All products are displayed subject to availability; images are
                for illustration only, and colours may vary slightly.
              </li>
              <li>
                Prices are listed in Indian Rupees (INR) and include GST unless
                stated otherwise. We reserve the right to change prices or
                discontinue items without notice.
              </li>
              <li>
                Inaccuracies (typographical or system errors) may be corrected,
                and your order amended or cancelled accordingly.
              </li>
            </ul>
          </li>

          {/* 4. Orders & Payment */}
          <li id="orders">
            <h2>Orders&nbsp;and&nbsp;Payment</h2>
            <ul className="space-y-1">
              <li>
                When you submit an order, it is an <em>offer</em> to purchase.
                Furnicasa reserves the right to accept or reject the offer.
              </li>
              <li>
                Payment gateways (Razorpay, UPI, net-banking, credit/debit cards)
                process your transaction; Furnicasa never stores full card details.
              </li>
              <li>
                Orders are considered confirmed only after full payment (or an
                agreed milestone payment) is received.
              </li>
            </ul>
          </li>

          {/* 5. Cancellations & Changes */}
          <li id="cancellations">
            <h2>Cancellations&nbsp;&amp;&nbsp;Changes</h2>
            <ul className="space-y-1">
              <li>
                <strong>Made-to-order furniture:</strong> may be cancelled within
                24&nbsp;hours of payment. After that, a&nbsp;30&nbsp;% fabrication
                charge applies.
              </li>
              <li>
                Ready items may be cancelled (by contacting us) until they leave
                our warehouse.
              </li>
              <li>
                To request a change or cancellation, email&nbsp;
                <a href="mailto:cc.furnicasa@gmail.com" className="underline">
                  cc.furnicasa@gmail.com
                </a>{" "}
                quoting your order ID.
              </li>
            </ul>
          </li>

          {/* 6. Shipping, Holding & Warranty */}
          <li id="shipping">
            <h2>Shipping, Holding&nbsp;&amp;&nbsp;Warranty</h2>
            <p>
              Full details are provided in our&nbsp;
              <LinkWithUnderline to="/policies">Store&nbsp;Policies</LinkWithUnderline>, which
              form an integral part of these Terms.
            </p>
          </li>

          {/* 7. Intellectual Property */}
          <li id="ip">
            <h2>Intellectual&nbsp;Property</h2>
            <p>
              All content—logos, photos, text, graphics and layouts—is the
              exclusive property of Furnicasa or its licensors and is protected
              by Indian & international copyright laws. Reproduction or
              distribution without written consent is prohibited.
            </p>
          </li>

          {/* 8. User Generated Content */}
          <li id="ugc">
            <h2>Reviews&nbsp;&amp;&nbsp;Other User Content</h2>
            <ul className="space-y-1">
              <li>
                By submitting a review you grant Furnicasa a non-exclusive,
                royalty-free, perpetual licence to use, modify, display and
                distribute that content across any marketing channel.
              </li>
              <li>
                Furnicasa may remove content that is defamatory, obscene,
                infringing or irrelevant at its sole discretion.
              </li>
            </ul>
          </li>

          {/* 9. Limitation of Liability */}
          <li id="liability">
            <h2>Limitation&nbsp;of&nbsp;Liability</h2>
            <p>
              To the maximum extent permitted by law, Furnicasa, its directors,
              employees and affiliates shall not be liable for any indirect,
              incidental or consequential damages arising from the Service, even
              if advised of the possibility of such damages.
            </p>
          </li>

          {/* 10. Indemnification */}
          <li id="indemnify">
            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold Furnicasa harmless from any claim
              or demand, including reasonable attorneys’ fees, arising out of
              your breach of these Terms or violation of any law or third-party
              rights.
            </p>
          </li>

          {/* 11. Privacy */}
          <li id="privacy">
            <h2>Privacy</h2>
            <p>
              Our handling of personal data is described in the&nbsp;
              <LinkWithUnderline to="/privacy">Furnicasa Privacy&nbsp;Notice</LinkWithUnderline>.
              By using the Service you consent to that processing.
            </p>
          </li>

          {/* 12. Governing Law & Disputes */}
          <li id="law">
            <h2>Governing&nbsp;Law&nbsp;&amp;&nbsp;Dispute&nbsp;Resolution</h2>
            <p>
              These Terms are governed by the laws of India. Any dispute shall
              be subject to the exclusive jurisdiction of the courts of Jaipur,
              Rajasthan. You agree to attempt informal resolution with Furnicasa
              for at least 30&nbsp;days before filing suit.
            </p>
          </li>

          {/* 13. Changes */}
          <li id="changes">
            <h2>Changes&nbsp;to&nbsp;Terms</h2>
            <p>
              Furnicasa may modify these Terms at any time by posting the
              updated version on the site. Continued use of the Service
              constitutes acceptance of the revised Terms.
            </p>
          </li>

          {/* 14. Contact */}
          <li id="contact">
            <h2>Contact</h2>
            <p>
              Questions? Email&nbsp;
              <a href="mailto:cc.furnicasa@gmail.com" className="underline">
                cc.furnicasa@gmail.com
              </a>{" "}
              or write to Furnicasa, C-193, Riico Residential&nbsp;Colony,
              Sitapura, Jaipur&nbsp;302022, India.
            </p>
          </li>
        </ol>

        <p className="text-center text-xs text-gray-500 mt-12">
          © {new Date().getFullYear()} Furnicasa. All rights reserved.
        </p>
      </article>
    </div>
  );
}

/* helper so Tailwind keeps link styling even in prose */
const LinkWithUnderline = ({ to, children }) => (
  <a href={to} className="text-blue-600 underline">
    {children}
  </a>
);
