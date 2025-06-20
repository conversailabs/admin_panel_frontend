export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Voice AI Sales Agent Admin
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your AI sales agents and campaigns
          </p>
          <div className="space-x-4">
            <a
              href="/auth/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </a>
            <a
              href="/auth/signup"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}