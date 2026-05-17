import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import AgentStatus from './components/AgentStatus'
import ReportView from './components/ReportView'
import HistoryPanel from './components/HistoryPanel'
import axios from 'axios'
import './App.css'

function App() {
  const [appState, setAppState] = useState('idle') // idle, loading, done
  const [query, setQuery] = useState('')
  const [report, setReport] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const savedHistory = localStorage.getItem('researchmind_history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery)
    setAppState('loading')
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/research`, { query: searchQuery })
      setReport(response.data)
      setAppState('done')
      
      const newHistory = [response.data, ...history].slice(0, 10)
      setHistory(newHistory)
      localStorage.setItem('researchmind_history', JSON.stringify(newHistory))
    } catch (error) {
      console.error(error)
      alert("Error generating report. Please try again.")
      setAppState('idle')
    }
  }

  const handleReset = () => {
    setAppState('idle')
    setQuery('')
    setReport(null)
  }

  return (
    <div className="flex h-screen w-full bg-dark-bg text-white overflow-hidden font-sans">
      <div className="w-64 border-r border-dark-border flex-shrink-0 bg-dark-surface hidden md:block">
        <HistoryPanel history={history} onSelect={setReport} onSearch={handleSearch} onClear={() => {setHistory([]); localStorage.removeItem('researchmind_history')}} />
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col relative bg-dark-bg">
        {appState === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-2">ResearchMind</h1>
            <p className="text-dark-textSecondary mb-8">Type a topic. Get a full research report in minutes.</p>
            <SearchBar onSearch={handleSearch} />
          </div>
        )}

        {appState === 'loading' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <AgentStatus />
          </div>
        )}

        {appState === 'done' && report && (
          <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
            <ReportView report={report} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
