export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">Loading 3D Skeleton...</p>
      </div>
    </div>
  );
}
