export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Ładowanie tablicy...</p>
      </div>
    </div>
  );
}
