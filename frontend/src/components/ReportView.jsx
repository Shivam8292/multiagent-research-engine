import { FileDown, RefreshCcw, BookOpen, Quote, ShieldCheck, Link } from 'lucide-react'
import jsPDF from 'jspdf'
import ReactMarkdown from 'react-markdown'

export default function ReportView({ report, onReset }) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    let y = 20
    const margin = 20
    const pageHeight = doc.internal.pageSize.height

    doc.setFontSize(22)
    const titleLines = doc.splitTextToSize(report.query, 170)
    doc.text(titleLines, margin, y)
    y += titleLines.length * 10 + 10

    doc.setFontSize(14)
    doc.text("Executive Summary", margin, y)
    y += 10
    
    doc.setFontSize(11)
    const summaryLines = doc.splitTextToSize(report.summary, 170)
    doc.text(summaryLines, margin, y)
    y += summaryLines.length * 7 + 10

    report.sections.forEach(section => {
      if (y > pageHeight - 40) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(14)
      doc.text(section.title.replace(/#/g, '').trim(), margin, y)
      y += 10
      
      doc.setFontSize(11)
      const contentLines = doc.splitTextToSize(section.content, 170)
      
      // Simple pagination for long content
      for(let i=0; i<contentLines.length; i++) {
        if (y > pageHeight - 20) {
          doc.addPage()
          y = 20
        }
        doc.text(contentLines[i], margin, y)
        y += 7
      }
      y += 10
    })

    if (y > pageHeight - 40) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(14)
    doc.text("References & Sources", margin, y)
    y += 10
    doc.setFontSize(10)
    report.sources.forEach(source => {
      const sourceLines = doc.splitTextToSize(source, 170)
      doc.text(sourceLines, margin, y)
      y += sourceLines.length * 6 + 4
      if (y > pageHeight - 20) {
        doc.addPage()
        y = 20
      }
    })

    doc.save(`Research_${report.query.substring(0, 20).replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <div className="space-y-6">
      
      {/* Sticky Report Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-app-surface/80 backdrop-blur-md p-4 rounded-2xl border border-app-border/80 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck size={16} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-app-textSecondary/60 uppercase tracking-wider block">Compiled Successfully</span>
            <span className="text-xs font-semibold text-app-textSecondary">Quality Verified by Critic</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-app-border hover:border-app-text/10 bg-app-surface hover:bg-app-hover text-app-textSecondary hover:text-app-text rounded-xl text-sm font-semibold active:scale-[0.97] transition-all duration-200"
          >
            <FileDown size={15} /> Download PDF
          </button>
          
          <button 
            onClick={onReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-app-accent to-indigo-600 hover:from-indigo-600 hover:to-app-accentHover text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/10 active:scale-[0.97] transition-all duration-200"
          >
            <RefreshCcw size={15} /> Research Again
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 md:p-10 shadow-xl space-y-8">
        
        {/* Main Query Title */}
        <div className="border-b border-app-border/40 pb-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-app-accent/15 text-app-accent flex items-center justify-center flex-shrink-0 mt-1">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3.5xl font-extrabold text-app-text capitalize leading-tight tracking-tight">
              {report.query}
            </h1>
            <p className="text-xs text-app-textSecondary mt-2 flex items-center gap-1.5 font-medium">
              <span>Systematic Review</span>
              <span className="w-1 h-1 rounded-full bg-app-border" />
              <span>Multi-Agent Synthesis</span>
              <span className="w-1 h-1 rounded-full bg-app-border" />
              <span>Live Web Checked</span>
            </p>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="relative overflow-hidden rounded-2xl border border-app-accent/20 bg-gradient-to-r from-app-accent/[0.03] to-indigo-500/[0.03] p-6 shadow-sm">
          <div className="absolute -top-3 -right-3 text-app-accent/10 opacity-30 select-none pointer-events-none">
            <Quote size={120} />
          </div>
          <h2 className="font-display font-extrabold text-lg text-app-accent flex items-center gap-2 mb-3">
            Executive Summary
          </h2>
          <p className="text-app-textSecondary leading-relaxed text-sm md:text-base font-medium">
            {report.summary}
          </p>
        </div>

        {/* Report Sections */}
        <div className="space-y-8 divide-y divide-app-border/40">
          {report.sections.map((section, idx) => (
            <div key={idx} className={`pt-8 ${idx === 0 ? 'pt-0' : ''}`}>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-4 text-app-text tracking-tight">
                {section.title.replace(/#/g, '').trim()}
              </h3>
              <div className="prose max-w-none">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Sources & References section */}
        {report.sources && report.sources.length > 0 && (
          <div className="pt-8 border-t border-app-border/40">
            <h3 className="font-display text-lg font-extrabold mb-4 text-app-text flex items-center gap-2">
              <Link size={18} className="text-app-accent" /> References & Web Sources
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {report.sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-bg hover:bg-app-hover text-app-textSecondary hover:text-app-accent transition-all duration-200 group text-sm min-w-0"
                >
                  <div className="w-6 h-6 rounded bg-app-surface flex items-center justify-center flex-shrink-0 text-app-textSecondary/60 border border-app-border group-hover:text-app-accent group-hover:border-app-accent/30 transition-colors">
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  </div>
                  <span className="truncate flex-1 font-medium">{source}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
