// src/pages/CertificateSingle.jsx
import { useParams, Link } from "react-router-dom";

const KNOWN_CERT_ID = "DU-LP-DM2025-2909";

export default function CertificateSingle() {
  const { certId } = useParams();
  const valid = certId === KNOWN_CERT_ID;
  const year = new Date().getFullYear();

  if (!valid) {
    return (
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Certificate Not Found</h1>
        <p className="text-gray-600">
          The certificate ID <span className="font-mono">{certId}</span> is not recognized.
        </p>
        <Link to="/" className="text-orange-600 underline mt-4 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Issued-by banner */}
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700 ring-1 ring-orange-200">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
          Issued by Furnicasa
        </span>
        <span className="text-sm text-gray-500">© {year}</span>
      </div>

      <h1 className="text-3xl font-bold">Furnicasa Certificate</h1>
      <p className="mt-2 text-sm text-gray-600">
        Certificate ID: <span className="font-mono">{KNOWN_CERT_ID}</span>
      </p>
      <p className="mt-1 text-xs text-gray-500">
        This page verifies the authenticity of the printed certificate.
      </p>

      <div className="mt-6 border rounded-lg overflow-hidden bg-white">
        <img
          src="/assets/certificates/furnicasa-cert.png"
          alt="Furnicasa Certificate"
          className="w-full max-w-3xl mx-auto block"
        />
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Furnicasa © {year}
      </div>
    </div>
  );
}
