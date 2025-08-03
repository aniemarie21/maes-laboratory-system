export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-emerald-200 shadow-2xl rounded-xl p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl mx-auto flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-emerald-800">Loading Portal...</h2>
            <p className="text-gray-600">Please wait while we prepare your login page</p>
          </div>
        </div>
      </div>
    </div>
  )
}
