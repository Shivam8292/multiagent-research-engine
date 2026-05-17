import { useState } from 'react'
import { ArrowUp, Sparkles, BookOpen, Globe } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    onSearch(query.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  const suggestions = [
    { text: "Future of Quantum Computing", icon: <Sparkles size={13} /> },
    { text: "Impact of AI on Healthcare", icon: <BookOpen size={13} /> },
    { text: "Global Renewable Energy Trends", icon: <Globe size={13} /> }
  ]

  return (
    <div className="w-full max-w-3xl flex flex-col gap-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full relative rounded-2xl border border-app-border bg-app-surface shadow-xl hover:shadow-2xl focus-within:ring-2 focus-within:ring-app-accent/20 focus-within:border-app-accent/70 transition-all duration-300 overflow-hidden"
      >
        <div className="p-4 flex flex-col gap-2">
          {/* Main textarea for typing, like Claude */}
          <textarea
            rows="3"
            className="w-full outline-none text-base text-app-text bg-transparent placeholder-app-textSecondary/50 resize-none pr-12 font-sans font-medium leading-relaxed"
            id="search"
            placeholder="Ask ResearchMind to deeply investigate any topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          
          {/* Bottom Bar inside input card */}
          <div className="flex items-center justify-between border-t border-app-border/40 pt-3 mt-1 text-xs text-app-textSecondary">
            <span className="flex items-center gap-1.5 opacity-60">
              <Sparkles size={14} className="text-app-accent animate-pulse" />
              Uses 5 Collaborative AI Agents & Web Search
            </span>

            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="w-9 h-9 rounded-xl bg-app-accent hover:bg-app-accentHover text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-indigo-500/10 active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Topics Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
        <span className="text-xs text-app-textSecondary/50 font-medium mr-1">Suggestions:</span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setQuery(s.text)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-app-border bg-app-surface/60 hover:bg-app-hover text-xs text-app-textSecondary hover:text-app-text transition-all duration-200 shadow-sm"
          >
            {s.icon}
            {s.text}
          </button>
        ))}
      </div>
    </div>
  )
}
