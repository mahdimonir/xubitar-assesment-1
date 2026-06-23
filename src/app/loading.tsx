export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-8 animate-pulse select-none">
      <div className="flex items-center justify-between mb-8">
        <div className="h-9 w-40 bg-gray-200 rounded-lg"></div>
        <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="h-8 w-60 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-10 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 py-3.5 border-b border-gray-50 items-center">
              <div className="h-4 bg-gray-200 rounded col-span-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded col-span-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
