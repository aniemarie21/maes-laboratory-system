export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Main spinner */}
          <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>

          {/* Secondary spinner */}
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>

          {/* Inner glow */}
          <div className="absolute inset-2 w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-20 animate-pulse mx-auto"></div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-gray-900">Loading MAES Laboratory</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Please wait while we prepare your enhanced healthcare experience...
          </p>

          {/* Progress dots */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
