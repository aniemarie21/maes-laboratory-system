export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-green-200 shadow-2xl rounded-xl p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-2xl mx-auto flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-green-800">Setting Up Registration...</h2>
            <p className="text-gray-600">Please wait while we prepare the registration form</p>
          </div>
        </div>
      </div>
    </div>
  )
}
