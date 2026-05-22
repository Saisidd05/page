import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

function ExportButton({ targetRef, disabled }) {
  const handleExport = async () => {
    if (!targetRef.current) {
      return
    }

    const element = targetRef.current
    const canvas = await html2canvas(element, { backgroundColor: 'transparent', scale: 2 })
    const imageData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imageProps = pdf.getImageProperties(imageData)
    const ratio = Math.min(pageWidth / imageProps.width, pageHeight / imageProps.height)

    pdf.addImage(imageData, 'PNG', 20, 20, imageProps.width * ratio - 40, imageProps.height * ratio - 40)
    pdf.save('page-fault-analyzer.pdf')
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleExport}
      className="rounded-full theme-button-alt border theme-border px-4 py-3 text-left text-sm font-semibold text-current transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Export Results as PDF
    </button>
  )
}

export default ExportButton
