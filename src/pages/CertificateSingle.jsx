// src/pages/CertificateSingle.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, ShieldAlert, ArrowLeft, Download } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import Tilt from "../components/ui/Tilt";
import { EmptyState } from "../components/ui/Bits";
import { EASE, spring } from "../components/ui/motion";

const KNOWN_CERT_ID = "DU-LP-DM2025-2909";
const HOLDER = "Deeksha Meena";

export default function CertificateSingle() {
  const { certId } = useParams();
  const valid = certId === KNOWN_CERT_ID;
  const year = new Date().getFullYear();

  if (!valid) {
    return (
      <div>
        <PageHeader
          kicker="Verification"
          title="Certificate not found"
          crumbs={[{ label: "Home", to: "/" }, { label: "Certificate" }]}
          compact
        />
        <EmptyState
          icon={ShieldAlert}
          title="We can't verify that ID"
          description={`The certificate ID "${certId}" isn't recognised. Please check it and try again.`}
          action={
            <Link to="/" className="btn-primary">
              <ArrowLeft size={16} />
              Back to home
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Verified certificate"
        title="Certificate of completion"
        subtitle={`Issued by Furnicasa to ${HOLDER}.`}
        crumbs={[{ label: "Home", to: "/" }, { label: "Certificate" }]}
        compact
      />

      <div className="container-x py-14">
        {/* verification banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-5 rounded-3xl border border-jade-200 bg-jade-50 p-7 text-center sm:flex-row sm:text-left"
        >
          <motion.span
            initial={{ scale: 0.6, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...spring, delay: 0.15 }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-jade-500 text-white shadow-[0_10px_28px_-8px_rgba(62,125,100,.8)]"
          >
            <BadgeCheck size={26} />
          </motion.span>

          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-jade-800">
              This certificate is authentic
            </p>
            <p className="mt-1 text-sm text-jade-700">
              Issued by Furnicasa · © {year}
            </p>
          </div>

          <dl className="text-center sm:text-right">
            <dt className="text-[11px] font-semibold uppercase tracking-[.16em] text-jade-600">
              Certificate ID
            </dt>
            <dd className="font-mono text-sm font-semibold text-jade-900">
              {KNOWN_CERT_ID}
            </dd>
          </dl>
        </motion.div>

        {/* the certificate itself */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
          className="mx-auto max-w-4xl"
        >
          <Tilt max={5} scale={1.01} perspective={1600}>
            <div className="overflow-hidden rounded-[2rem] border border-ink-100 bg-white p-3 shadow-float sm:p-5">
              <img
                src="/assets/certificates/furnicasa-cert.png"
                alt={`Furnicasa certificate of completion issued to ${HOLDER}`}
                className="w-full rounded-2xl"
              />
            </div>
          </Tilt>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/assets/certificates/furnicasa-cert.png"
              download
              className="btn-ink"
            >
              <Download size={16} />
              Download certificate
            </a>
            <Link to="/" className="btn-outline">
              Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
