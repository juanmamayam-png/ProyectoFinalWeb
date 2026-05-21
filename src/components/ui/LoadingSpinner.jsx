export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100"></div>
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      {message && (
        <p className="text-gray-500 text-sm">{message}</p>
      )}
    </div>
  );
}
