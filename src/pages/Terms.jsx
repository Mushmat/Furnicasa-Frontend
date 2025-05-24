// src/pages/Terms.jsx
import React from "react";

const termsText =
  "Terms and Conditions\n" +
  "\n" +
  "Last updated: May 24, 2025\n" +
  "\n" +
  "Welcome to Furnicasa (https://www.furnicasa.in). These Terms and Conditions (\"Terms\") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.\n" +
  "\n" +
  "1. Online Store Terms\n" +
  "\n" +
  "By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.\n" +
  "\n" +
  "2. Products and Services\n" +
  "\n" +
  "All products or services are subject to availability. We reserve the right to discontinue any products at any time. Prices for our products are subject to change without notice.\n" +
  "\n" +
  "3. Accuracy of Billing and Account Information\n" +
  "\n" +
  "We reserve the right to refuse any order you place with us. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.\n" +
  "\n" +
  "4. Limitation of Liability\n" +
  "\n" +
  "In no event shall Furnicasa nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of our services.\n" +
  "\n" +
  "5. Governing Law\n" +
  "\n" +
  "These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.\n" +
  "\n" +
  "6. Changes to Terms\n" +
  "\n" +
  "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.\n" +
  "\n" +
  "7. Contact Information\n" +
  "\n" +
  "For any questions about these Terms, please contact us at edu.chirayu2005@gmail.com.\n";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Furnicasa&nbsp;— Terms&nbsp;&amp;&nbsp;Conditions
        </h1>

        {/* preserve line breaks nicely */}
        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
          {termsText}
        </pre>
      </div>
    </div>
  );
}
