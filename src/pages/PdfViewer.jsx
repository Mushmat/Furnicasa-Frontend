// src/pages/PdfViewer.jsx
import { useEffect } from "react";

export default function PdfViewer() {
  return (
    <div className="h-screen w-full">
      <iframe
        src="/company_profile.pdf"
        className="w-full h-full"
        title="Company Profile"
      />
    </div>
  );
}
