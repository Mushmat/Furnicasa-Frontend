// src/pages/Terms.jsx
import React from "react";


const termsHTML = `
Terms and Conditions

Last updated: May 24, 2025

Welcome to Furnicasa (https://www.furnicasa.in). These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.

1. Online Store Terms

By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.

2. Products and Services

All products or services are subject to availability. We reserve the right to discontinue any products at any time. Prices for our products are subject to change without notice.

3. Accuracy of Billing and Account Information

We reserve the right to refuse any order you place with us. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.

4. Limitation of Liability

In no event shall Furnicasa nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of our services.

5. Governing Law

These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.

6. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.

7. Contact Information

For any questions about these Terms, please contact us at edu.chirayu2005@gmail.com.
</pre>
`;

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Furnicasa&nbsp;— Terms&nbsp;&amp;&nbsp;Conditions
        </h1>
        <div
          className="prose max-w-none overflow-y-auto h-[70vh] pr-4"
          dangerouslySetInnerHTML={{ __html: termsHTML }}
        />
      </div>
    </div>
  );
}
