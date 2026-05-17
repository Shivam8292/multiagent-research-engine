import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react'

const agentsList = [
  { id: 'planner', name: 'Planner Agent', desc: 'Breaking query into subtopics...' },
  { id: 'researcher', name: 'Researcher Agent', desc: 'Searching the web for data...' },
  { id: 'writer', name: 'Writer Agent', desc: 'Drafting the report sections...' },
  { id: 'critic', name: 'Critic Agent', desc: 'Reviewing report quality...' },
  { id: 'compiler', name: 'Compiler Agent', desc: 'Building final report...' },
]

export default function AgentStatus() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate progress over time (e.g. 3 minutes = 180 seconds, but we will do it faster for simulation, maybe 30 seconds total simulation)
    // Actually, prompt says: "simulate agent progress: 0-10%: Planner, 10-40%: Researcher, 40-70%: Writer, 70-85%: Critic, 85-100%: Compiler"
    // Let's increment progress from 0 to 95 over 60 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95
        return prev + 1
      })
    }, 600) // 1% every 600ms -> 60s to 100%
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
    <div className="w-full max-w-2xl bg-dark-surface border border-dark-border rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Loader2 className="animate-spin text-indigo-500" />
        Generating Research Report
      </h2>
      
      <div className="space-y-4">
        {agentsList.map((agent, idx) => {
          const state = getAgentState(idx, progress)
          
          let Icon = Circle
          let iconColor = "text-gray-600"
          let borderColor = "border-transparent"
          
          if (state === 'active') {
            Icon = Loader2
            iconColor = "text-indigo-500 animate-spin"
            borderColor = "border-l-indigo-500"
          } else if (state === 'done') {
            Icon = CheckCircle2
            iconColor = "text-green-500"
            borderColor = "border-l-green-500"
          } else {
            borderColor = "border-l-gray-700"
          }

          return (
            <div key={agent.id} className={`flex items-center p-4 bg-dark-bg rounded-lg border border-dark-border border-l-4 ${borderColor} transition-colors duration-300`}>
              <div className={`mr-4 ${iconColor}`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className={`font-semibold ${state === 'pending' ? 'text-gray-500' : 'text-white'}`}>
                  {agent.name}
                </h3>
                <p className={`text-sm ${state === 'pending' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {agent.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 h-2 w-full bg-dark-bg rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
