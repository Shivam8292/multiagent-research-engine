import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import AgentStatus from './components/AgentStatus'
import ReportView from './components/ReportView'
import HistoryPanel from './components/HistoryPanel'
import { AlertCircle, X, Menu, Sparkles, Plus, Sun, Moon } from 'lucide-react'
import axios from 'axios'

function App() {
  const [appState, setAppState] = useState('idle') // idle, loading, done
  const [query, setQuery] = useState('')
  const [report, setReport] = useState(null)
  const [history, setHistory] = useState([])
  const [toast, setToast] = useState(null)
  const [darkMode, setDarkMode] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Check Health
    const checkHealth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/health`)
        if (res.data.status === 'error') {
          showToast(res.data.message, 'error')
        }
      } catch (err) {
        showToast("Cannot connect to backend server.", 'error')
      }
    }
    checkHealth()

    // Load History
    const savedHistory = localStorage.getItem('researchmind_history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }

    // Load Theme
    const savedTheme = localStorage.getItem('researchmind_theme')
    const initialDarkMode = savedTheme !== 'light' // Default to dark mode
    setDarkMode(initialDarkMode)
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('researchmind_theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('researchmind_theme', 'light')
      }
      return next
    })
  }

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery)
    setAppState('loading')
    setIsSidebarOpen(false)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/research`, { query: searchQuery })
      setReport(response.data)
      setAppState('done')
      
      const newHistory = [response.data, ...history].slice(0, 10)
      setHistory(newHistory)
      localStorage.setItem('researchmind_history', JSON.stringify(newHistory))
    } catch (error) {
      console.error(error)
      showToast("Agent failed, please try again.")
      setAppState('idle')
    }
  }

  const handleSelectReport = (selectedReport) => {
    setReport(selectedReport)
    setAppState('done')
    setIsSidebarOpen(false)
  }

  const handleReset = () => {
    setAppState('idle')
    setQuery('')
    setReport(null)
  }

  return (
    <div className="flex h-screen w-full bg-app-bg text-app-text overflow-hidden font-sans transition-colors duration-300">
      
      {/* Toast Alert */}
      {toast && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3 bg-red-500 text-white px-4 py-3 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-4 border border-red-400/20">
          <AlertCircle size={18} />
          <p className="text-sm font-semibold">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-2 hover:bg-red-600 rounded-lg p-1 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Left Sidebar (Desktop) */}
      <div className="w-72 flex-shrink-0 hidden md:block">
        <HistoryPanel 
          history={history} 
          onSelect={handleSelectReport} 
          onReset={handleReset} 
          onClear={() => {setHistory([]); localStorage.removeItem('researchmind_history')}} 
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar (Mobile Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden shadow-2xl`}>
        <HistoryPanel 
          history={history} 
          onSelect={handleSelectReport} 
          onReset={handleReset} 
          onClear={() => {setHistory([]); localStorage.removeItem('researchmind_history')}} 
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-app-border/70 px-4 md:px-8 flex items-center justify-between bg-app-surface/40 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button (Mobile) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-app-hover rounded-xl border border-app-border text-app-textSecondary md:hidden transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-app-accent to-indigo-400 flex items-center justify-center text-white shadow-md">
                <Sparkles size={14} />
              </div>
              <span className="font-display font-extrabold text-base tracking-tight">ResearchMind</span>
            </div>
            {appState === 'done' && report && (
              <span className="hidden md:inline-block text-xs font-semibold text-app-textSecondary bg-app-hover border border-app-border px-3 py-1 rounded-full capitalize">
                Query: {report.query}
              </span>
            )}
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            {appState === 'done' && report && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-app-accent to-indigo-600 hover:from-indigo-600 hover:to-app-accentHover text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/10 transition-all duration-200 active:scale-95"
              >
                <Plus size={14} />
                New Research
              </button>
            )}
            
            {/* Quick Theme Switcher (Header - Mobile Only to avoid duplicate footer switcher) */}
            <button
              onClick={toggleTheme}
              className="md:hidden w-8 h-8 rounded-xl border border-app-border bg-app-surface hover:bg-app-hover flex items-center justify-center text-app-textSecondary hover:text-app-text transition-all duration-200"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 overflow-y-auto bg-app-bg transition-colors duration-300">
          
          {appState === 'idle' && (
            <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-8 max-w-4xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-app-accent to-indigo-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/10 mb-6">
                <Sparkles size={32} className="animate-pulse" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-app-text via-app-text to-indigo-500">
                ResearchMind
              </h1>
              <p className="text-sm md:text-base text-app-textSecondary/70 mb-8 max-w-lg text-center leading-relaxed">
                Unlock high-precision, deep reports using 5 collaborative AI agents that plan, crawl, write, critique, and compile for you.
              </p>
              <SearchBar onSearch={handleSearch} />
            </div>
          )}

          {appState === 'loading' && (
            <div className="min-h-full flex items-center justify-center p-6 md:p-8">
              <AgentStatus />
            </div>
          )}

          {appState === 'done' && report && (
            <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
              <ReportView report={report} onReset={handleReset} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
