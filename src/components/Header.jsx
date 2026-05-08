import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'User'

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <header className="text-white shadow-lg" style={{ background: 'linear-gradient(to right, #006837, #1f7d3a)' }}>
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">IGL Meter Reader</h1>
          <p className="text-igl-light/90 text-sm">Welcome, {username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
