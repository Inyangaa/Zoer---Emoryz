import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Zoer
          </h1>
          <p className="text-2xl text-gray-600 mb-2">Emotional Recycling</p>
          <p className="text-lg text-gray-500">
            Transform your emotions into insights with AI
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Welcome to Your Emotional Journey
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Zoer helps you understand and process your emotions through
            AI-powered journaling, emotion analysis, and creative visualization.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-semibold text-lg mb-2">Journal</h3>
              <p className="text-gray-600 text-sm">
                Write your thoughts and feelings
              </p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-xl">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Get insights into your emotions
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-semibold text-lg mb-2">Visualize</h3>
              <p className="text-gray-600 text-sm">
                Generate art from your feelings
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all border-2 border-gray-200"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="text-gray-500 text-sm">
          <p>Built with Next.js, PostgreSQL, and OpenAI</p>
        </div>
      </div>
    </div>
  );
}
