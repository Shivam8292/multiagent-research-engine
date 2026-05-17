import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
      <div className="relative flex items-center w-full h-14 rounded-xl focus-within:shadow-lg bg-dark-surface border border-dark-border overflow-hidden">
        <div className="grid place-items-center h-full w-12 text-gray-400">
          <Search size={20} />
        </div>

        <input
          className="peer h-full w-full outline-none text-sm text-white pr-2 bg-transparent placeholder-gray-500"
          type="text"
          id="search"
          placeholder="What do you want to research?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="h-10 px-6 m-2 text-white transition-colors duration-150 bg-indigo-600 rounded-lg focus:shadow-outline hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Starting...' : 'Research'}
        </button>
      </div>
    </form>
  )
}
