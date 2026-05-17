import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Loader2, Sparkles, Brain, Cpu, MessageSquareCheck, Layers } from 'lucide-react'

const agentsList = [
  { id: 'planner', name: 'Planner Agent', desc: 'Analyzing query and plotting subtopics...', icon: <Layers size={16} /> },
  { id: 'researcher', name: 'Researcher Agent', desc: 'Crawling Tavily for live content and sources...', icon: <Cpu size={16} /> },
  { id: 'writer', name: 'Writer Agent', desc: 'Synthesizing data into detailed sections...', icon: <Sparkles size={16} /> },
  { id: 'critic', name: 'Critic Agent', desc: 'Grading accuracy and generating feedback loop...', icon: <Brain size={16} /> },
  { id: 'compiler', name: 'Compiler Agent', desc: 'Applying improvements and formatting markdown...', icon: <MessageSquareCheck size={16} /> },
]

export default function AgentStatus() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Increment progress to simulate real multi-agent latency
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return 98
        return prev + 1
      })
    }, 900) // ~90 seconds total to reach full 98%, realistic agent execution time
    return () => clearInterval(interval)
  }, [])

  const getAgentState = (index, currentProgress) => {
    let thresholds = [0, 10, 40, 70, 85, 100]
    let start = thresholds[index]
    let end = thresholds[index + 1]
    
    if (currentProgress < start) return 'pending'
    if (currentProgress >= start && currentProgress < end) return 'active'
    return 'done'
  }

  return (
    <div className="w-full max-w-xl bg-app-surface border border-app-border rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
      
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-app-accent/15 text-app-accent flex items-center justify-center animate-pulse">
          <Loader2 className="animate-spin" size={18} />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-app-text">Multi-Agent Deep Research Running</h2>
          <p className="text-xs text-app-textSecondary/60">Collaborative intelligence in progress...</p>
        </div>
      </div>
      
      {/* Agents List Card Stack */}
      <div className="space-y-3">
        {agentsList.map((agent, idx) => {
          const state = getAgentState(idx, progress)
          
          let statusIcon = <Circle size={15} />
          let rowClass = "opacity-40"
          let badgeText = "Pending"
          let badgeColor = "bg-app-hover/50 text-app-textSecondary/70 border-app-border/40"
          
          if (state === 'active') {
            statusIcon = <Loader2 className="animate-spin" size={15} />
            rowClass = "border-app-accent/40 bg-app-accent/5 ring-1 ring-app-accent/10 shadow-lg shadow-app-accent/5"
            badgeText = "Working"
            badgeColor = "bg-app-accent/15 text-app-accent border-app-accent/20 animate-pulse"
          } else if (state === 'done') {
            statusIcon = <CheckCircle2 size={15} />
            rowClass = "border-emerald-500/20 bg-emerald-500/5"
            badgeText = "Completed"
            badgeColor = "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
          }

          return (
            <div 
              key={agent.id} 
              className={`flex items-center justify-between p-4 rounded-xl border border-app-border bg-app-surface transition-all duration-300 ${rowClass}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-app-hover text-app-textSecondary group-hover:text-app-text transition-colors duration-200`}>
                  {agent.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-app-text truncate">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-app-textSecondary truncate mt-0.5">
                    {agent.desc}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase ${badgeColor}`}>
                {statusIcon}
                {badgeText}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Progress Bar Area */}
      <div className="mt-8">
        <div className="flex items-center justify-between text-xs font-bold text-app-textSecondary/60 mb-2">
          <span>Overall Research Progress</span>
          <span className="text-app-accent">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-app-hover rounded-full overflow-hidden border border-app-border/40">
          <div 
            className="h-full bg-gradient-to-r from-app-accent to-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
