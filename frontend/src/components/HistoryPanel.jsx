import { Clock, Trash2, ChevronRight, FileText, Plus, Sun, Moon, Sparkles } from 'lucide-react'

export default function HistoryPanel({ history, onSelect, onReset, onClear, darkMode, onToggleTheme }) {
  return (
    <div className="h-full flex flex-col bg-app-sidebar border-r border-app-border text-app-text">
      {/* Sidebar Header */}
      <div className="p-5 flex flex-col gap-4 border-b border-app-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-app-accent to-indigo-400 flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">ResearchMind</span>
          </div>
        </div>

        {/* New Research Button */}
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-app-accent to-indigo-600 hover:from-indigo-600 hover:to-app-accentHover text-white py-3 px-4 rounded-xl font-medium shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 text-sm"
        >
          <Plus size={16} />
          New Research
        </button>
      </div>

      {/* History List */}
      <div className="p-4 border-b border-app-border flex justify-between items-center bg-app-sidebar/50">
        <h2 className="font-display font-semibold text-xs tracking-wider uppercase text-app-textSecondary flex items-center gap-1.5">
          <Clock size={12} /> Recent Research
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-app-textSecondary hover:text-red-500 hover:bg-red-500/10 rounded-lg p-1 transition-all duration-200"
            title="Clear history"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {history.length === 0 ? (
          <div className="text-xs text-app-textSecondary/70 text-center mt-12 px-4 py-8 border border-dashed border-app-border rounded-xl bg-app-bg/30">
            No research history yet. Your detailed reports will appear here.
          </div>
        ) : (
          history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-xl hover:bg-app-hover border border-transparent hover:border-app-border/40 transition-all duration-200 group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-app-accent/10 text-app-accent flex items-center justify-center flex-shrink-0 group-hover:bg-app-accent group-hover:text-white transition-colors duration-200">
                <FileText size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-app-textSecondary group-hover:text-app-text truncate transition-colors duration-200">
                  {item.query}
                </p>
                <p className="text-xs text-app-textSecondary/60 mt-0.5">
                  {new Date(item.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <ChevronRight size={14} className="text-app-textSecondary/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 mt-2 transition-all duration-200" />
            </button>
          ))
        )}
      </div>

      {/* Footer Profile & Theme Toggle */}
      <div className="p-4 border-t border-app-border bg-app-sidebar/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-app-accent/20 to-indigo-500/20 text-app-accent border border-app-accent/15 flex items-center justify-center font-bold text-sm flex-shrink-0">
            S
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-app-text truncate">Shivam</p>
            <span className="inline-block px-1.5 py-0.5 rounded-md bg-app-accent/15 text-[10px] font-bold text-app-accent tracking-wider uppercase">
              Free Plan
            </span>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-xl border border-app-border bg-app-bg hover:bg-app-hover flex items-center justify-center text-app-textSecondary hover:text-app-text hover:border-app-text/20 transition-all duration-200 shadow-sm"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  )
}
