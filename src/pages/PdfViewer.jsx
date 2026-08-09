// src/pages/PdfViewer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ExternalLink, ArrowLeft } from "lucide-react";
import { EASE } from "../components/ui/motion";

const FILE = "/company_profile.pdf";

export default function PdfViewer() {
  return (
    <div className="bg-ink-950">
      {/* toolbar */}
      <div className="border-b border-white/10">
        <div className="container-x flex flex-wrap items-center gap-4 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-ink-300 transition-colors hover:text-sand-50"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          <div className="mx-auto text-center">
            <p className="font-display text-base font-semibold text-sand-50">
              Furnicasa company profile
            </p>
            <p className="text-xs text-ink-400">PDF document</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={FILE}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-sm border border-white/20 text-sand-50 hover:bg-white/10"
            >
              <ExternalLink size={14} />
              Open
            </a>
            <a href={FILE} download className="btn-primary btn-sm">
              <Download size={14} />
              Download
            </a>
          </div>
        </div>
      </div>

      {/* document */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="container-x py-6"
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-float">
          <iframe
            src={FILE}
            title="Furnicasa company profile"
            className="h-[calc(100vh-11rem)] min-h-[32rem] w-full bg-white"
          />
        </div>

        <p className="mt-4 text-center text-xs text-ink-500">
          Trouble viewing it here? Use “Open” to load the PDF in a new tab.
        </p>
      </motion.div>
    </div>
  );
}
