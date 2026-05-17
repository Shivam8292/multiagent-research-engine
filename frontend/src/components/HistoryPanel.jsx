import { Clock, Trash2, ChevronRight, FileText } from 'lucide-react'

export default function HistoryPanel({ history, onSelect, onSearch, onClear }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-dark-border flex justify-between items-center">
        <h2 className="font-semibold flex items-center gap-2 text-gray-200">
          <Clock size={18} /> History
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-gray-500 hover:text-red-400 transition-colors p-1"
            title="Clear history"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {history.length === 0 ? (
          <div className="text-sm text-gray-500 text-center mt-10">
            Your research history will appear here
          </div>
        ) : (
          history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-lg hover:bg-dark-bg border border-transparent hover:border-dark-border transition-all group flex items-start gap-3"
            >
              <FileText size={16} className="text-indigo-500 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                  {item.query}
                </p>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <ChevronRight size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 mt-1" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
