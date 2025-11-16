'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  emotion: string;
  emotion_score: number;
  ai_analysis: string;
  image_url: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchEntries(token);
  }, [router]);

  const fetchEntries = async (token: string) => {
    try {
      const response = await fetch('/api/journal', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data.entries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      joy: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      sadness: 'bg-blue-100 text-blue-800 border-blue-300',
      anger: 'bg-red-100 text-red-800 border-red-300',
      fear: 'bg-purple-100 text-purple-800 border-purple-300',
      neutral: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[emotion] || colors.neutral;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Your emotional journey</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/journal/new"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                + New Entry
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{entries.length}</div>
            <div className="text-gray-600 mt-1">Total Entries</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-indigo-600">
              {entries.filter((e) => e.image_url).length}
            </div>
            <div className="text-gray-600 mt-1">AI Images Generated</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-purple-600">
              {entries.length > 0 ? Math.round(entries.reduce((sum, e) => sum + e.emotion_score, 0) / entries.length * 100) : 0}%
            </div>
            <div className="text-gray-600 mt-1">Average Emotion Score</div>
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-12 text-center shadow-lg">
              <p className="text-gray-600 text-lg mb-4">No journal entries yet</p>
              <Link
                href="/journal/new"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Create Your First Entry
              </Link>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{entry.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEmotionColor(entry.emotion)}`}>
                    {entry.emotion}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{entry.content}</p>
                {entry.ai_analysis && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-800">
                      <strong>AI Insight:</strong> {entry.ai_analysis}
                    </p>
                  </div>
                )}
                {entry.image_url && (
                  <img
                    src={entry.image_url}
                    alt="AI Generated"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="text-sm text-gray-500">
                  {new Date(entry.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
