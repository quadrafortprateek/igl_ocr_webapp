import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    // Store auth state and navigate
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('username', username)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #006837 0%, #1f7d3a 100%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
            <span className="text-4xl font-bold" style={{ color: '#006837' }}>IGL</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">IGL Meter Reader</h1>
          <p className="text-igl-light/80 text-sm">Quick meter reading capture</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-igl-green focus:border-transparent transition"
              />
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-igl-green focus:border-transparent transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-lg hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5 mt-6"
              style={{ background: 'linear-gradient(135deg, #006837 0%, #1f7d3a 100%)' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Login
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 mb-3">Demo Credentials:</p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs text-gray-600">
              <p>Email: <span className="font-mono font-semibold">shubham.kunwar@igl.co.in</span></p>
              <p>Password: <span className="font-mono font-semibold">password</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-xs">
          Indraprastha Gas Limited © 2024
        </p>
      </div>
    </div>
  )
}
