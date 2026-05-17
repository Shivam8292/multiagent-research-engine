import { FileDown, RefreshCcw } from 'lucide-react'
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
    doc.text("Summary", margin, y)
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
    doc.text("Sources", margin, y)
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

    doc.save(`Research_${report.query.substring(0, 20)}.pdf`)
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-8 shadow-xl max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-white capitalize">{report.query}</h1>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-dark-bg border border-dark-border hover:bg-gray-800 rounded-lg text-sm transition-colors"
          >
            <FileDown size={16} /> Download PDF
          </button>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm transition-colors"
          >
            <RefreshCcw size={16} /> New Research
          </button>
        </div>
      </div>

      <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-indigo-400 mb-3">Executive Summary</h2>
        <p className="text-gray-300 leading-relaxed">
          {report.summary}
        </p>
      </div>

      <div className="space-y-8">
        {report.sections.map((section, idx) => (
          <div key={idx} className="border-b border-dark-border pb-8 last:border-0">
            <h3 className="text-xl font-bold mb-4 text-gray-100">{section.title.replace(/#/g, '').trim()}</h3>
            <div className="prose prose-invert max-w-none text-gray-300">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {report.sources && report.sources.length > 0 && (
        <div className="mt-12 pt-8 border-t border-dark-border">
          <h3 className="text-lg font-semibold mb-4 text-gray-400">Sources</h3>
          <ul className="space-y-2">
            {report.sources.map((source, idx) => (
              <li key={idx}>
                <a href={source} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm break-all">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
