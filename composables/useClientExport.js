import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export const useClientExport = () => {

  const exportToCSV = (filename, columns, data) => {
    const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',')
    const rows = data.map(row => {
      return columns.map(c => {
        let val = row[c.key]
        if (val === null || val === undefined) val = ''
        return `"${val.toString().replace(/"/g, '""')}"`
      }).join(',')
    })
    
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' }) // Added BOM for Excel UTF-8 support
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const exportToExcel = (filename, columns, data) => {
    const worksheetData = data.map(row => {
      const newRow = {}
      columns.forEach(c => {
        newRow[c.label] = row[c.key]
      })
      return newRow
    })
    
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report")
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  const exportToPDF = (filename, columns, data, title = 'Report') => {
    const doc = new jsPDF()
    
    doc.setFontSize(16)
    doc.text(title, 14, 20)
    
    const head = [columns.map(c => c.label)]
    const body = data.map(row => columns.map(c => {
      let val = row[c.key]
      if (val === null || val === undefined) return ''
      return val.toString()
    }))
    
    autoTable(doc, {
      startY: 25,
      head: head,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105] } // Tailwind emerald-600
    })
    
    doc.save(`${filename}.pdf`)
  }

  const exportData = (format, filename, columns, data, title) => {
    switch (format) {
      case 'csv':
        exportToCSV(filename, columns, data)
        break
      case 'excel':
        exportToExcel(filename, columns, data)
        break
      case 'pdf':
        exportToPDF(filename, columns, data, title)
        break
      default:
        console.error('Unknown export format:', format)
    }
  }

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportData
  }
}
