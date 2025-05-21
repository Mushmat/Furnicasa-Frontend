import { useLoading } from "../context/LoadingContext";

export default function LoadingOverlay() {
  const { loading } = useLoading();
  if (!loading) return null;              // nothing to show

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* simple Tailwind spinner */}
      <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
