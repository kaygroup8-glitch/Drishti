import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../types';

export const exportAnalysisToPDF = async (result: AnalysisResult) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage();
      cursorY = margin;
      drawHeader();
    }
  };

  const drawHeader = () => {
    // Header accent line
    doc.setDrawColor(250, 143, 121); // #FA8F79
    doc.setLineWidth(0.8);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(120, 113, 99);
    doc.text('DRISHTI | ACCESSIBILITY & UNIVERSAL DESIGN AUDIT REPORT', margin, 10);

    const dateStr = new Date(result.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    doc.text(dateStr, pageWidth - margin, 10, { align: 'right' });
  };

  // 1. First Page Header & Title
  drawHeader();
  cursorY = 22;

  // Title Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(26, 28, 32);
  doc.text('Accessibility Spatial Audit', margin, cursorY);
  cursorY += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 95, 85);
  doc.text(`Target Space: ${result.imageName || 'Audited Image'}`, margin, cursorY);
  cursorY += 8;

  // 2. Score & Executive Summary Card Box
  doc.setFillColor(250, 247, 240); // #FAF7F0
  doc.setDrawColor(232, 222, 200); // #E8DEC8
  doc.roundedRect(margin, cursorY, contentWidth, 34, 3, 3, 'FD');

  // Left: Score block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(26, 28, 32);
  doc.text(`${result.accessibilityScore}`, margin + 8, cursorY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(120, 113, 99);
  doc.text('/ 100', margin + 30, cursorY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(250, 143, 121);
  doc.text(result.scoreLabel.toUpperCase(), margin + 8, cursorY + 24);

  // Divider inside card
  doc.setDrawColor(225, 215, 195);
  doc.line(margin + 65, cursorY + 5, margin + 65, cursorY + 29);

  // Right: Quick metrics & counts
  const highCount = result.findings.filter((f) => f.severity === 'High').length;
  const medCount = result.findings.filter((f) => f.severity === 'Medium').length;
  const lowCount = result.findings.filter((f) => f.severity === 'Low').length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(50, 45, 35);
  doc.text('Total Observations:', margin + 72, cursorY + 11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.findings.length} points detected`, margin + 112, cursorY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('High Severity:', margin + 72, cursorY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`${highCount} critical barrier(s)`, margin + 112, cursorY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14);
  doc.text('Medium Severity:', margin + 72, cursorY + 25);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 45, 35);
  doc.text(`${medCount} barrier(s) | ${lowCount} low/minor`, margin + 112, cursorY + 25);

  cursorY += 42;

  // 3. Top Priority Improvement Block
  if (result.highestPriorityImprovement) {
    checkPageBreak(25);
    doc.setFillColor(250, 244, 235);
    doc.setDrawColor(234, 219, 202);
    doc.roundedRect(margin, cursorY, contentWidth, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(217, 119, 6);
    doc.text('TOP PRIORITY ACTION', margin + 6, cursorY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 25, 20);
    const splitPriority = doc.splitTextToSize(result.highestPriorityImprovement, contentWidth - 12);
    doc.text(splitPriority, margin + 6, cursorY + 13);

    cursorY += 28;
  }

  // 4. Strengths & Areas Needing Attention
  checkPageBreak(40);
  const colWidth = (contentWidth - 6) / 2;

  // Strengths column
  doc.setFillColor(240, 250, 244);
  doc.setDrawColor(209, 235, 217);
  doc.roundedRect(margin, cursorY, colWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70);
  doc.text('STRENGTHS & POSITIVE ATTRIBUTES', margin + 5, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(40, 60, 50);
  let strY = cursorY + 13;
  result.strongAreas.slice(0, 3).forEach((item) => {
    const lines = doc.splitTextToSize(`• ${item}`, colWidth - 10);
    doc.text(lines, margin + 5, strY);
    strY += lines.length * 4 + 2;
  });

  // Areas needing attention column
  const col2X = margin + colWidth + 6;
  doc.setFillColor(254, 246, 245);
  doc.setDrawColor(252, 218, 214);
  doc.roundedRect(col2X, cursorY, colWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(153, 27, 27);
  doc.text('AREAS NEEDING ATTENTION', col2X + 5, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 30, 30);
  let attY = cursorY + 13;
  result.areasNeedingAttention.slice(0, 3).forEach((item) => {
    const lines = doc.splitTextToSize(`• ${item}`, colWidth - 10);
    doc.text(lines, col2X + 5, attY);
    attY += lines.length * 4 + 2;
  });

  cursorY += 45;

  // 5. Perspective Summary
  if (result.summary) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 28, 32);
    doc.text('Perspective Evaluation Summary', margin, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 65, 55);
    const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
    doc.text(summaryLines, margin, cursorY);
    cursorY += summaryLines.length * 4.5 + 8;
  }

  // 6. Detailed Findings Section
  checkPageBreak(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 28, 32);
  doc.text('Detailed Barrier Findings & Actionable Solutions', margin, cursorY);
  cursorY += 7;

  result.findings.forEach((finding) => {
    const minCardHeight = 44;
    checkPageBreak(minCardHeight);

    const cardStartY = cursorY;
    doc.setFillColor(250, 247, 240);
    doc.setDrawColor(230, 220, 200);
    doc.roundedRect(margin, cardStartY, contentWidth, minCardHeight, 2, 2, 'FD');

    // Number tag & Title
    doc.setFillColor(26, 28, 32);
    doc.roundedRect(margin + 4, cardStartY + 4, 6, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(250, 246, 238);
    doc.text(`${finding.id}`, margin + 7, cardStartY + 8.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 28, 32);
    doc.text(finding.title, margin + 13, cardStartY + 8.5);

    // Badges: Lens & Severity
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 60, 40);
    doc.text(`Lens: ${finding.lens}`, margin + 13, cardStartY + 14);

    doc.setTextColor(finding.severity === 'High' ? 153 : 146, finding.severity === 'High' ? 27 : 64, finding.severity === 'High' ? 27 : 14);
    doc.text(`Severity: ${finding.severity}`, margin + 65, cardStartY + 14);

    doc.setTextColor(110, 105, 95);
    doc.text(`Location: ${finding.location.label || 'Marked on canvas'}`, margin + 110, cardStartY + 14);

    // Detected & Improvement text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 45, 35);
    const obsText = doc.splitTextToSize(`Observation: ${finding.whatDetected}`, contentWidth - 10);
    doc.text(obsText, margin + 5, cardStartY + 20);

    let offsetAfterObs = cardStartY + 20 + obsText.length * 3.8;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    const recText = doc.splitTextToSize(`Recommended Fix: ${finding.suggestedImprovement}`, contentWidth - 10);
    doc.text(recText, margin + 5, offsetAfterObs + 2);

    let finalCardHeight = Math.max(minCardHeight, (offsetAfterObs - cardStartY) + recText.length * 3.8 + 6);
    
    // Re-draw outer card boundary to fit multi-line content perfectly
    doc.setFillColor(250, 247, 240);
    doc.roundedRect(margin, cardStartY, contentWidth, finalCardHeight, 2, 2, 'S');

    cursorY = cardStartY + finalCardHeight + 5;
  });

  // 7. Ethical AI Disclaimer on the last page
  checkPageBreak(30);
  doc.setFillColor(250, 242, 230);
  doc.setDrawColor(226, 210, 184);
  doc.roundedRect(margin, cursorY, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 85, 40);
  doc.text('ETHICAL AI & AUDIT DISCLAIMER', margin + 6, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(90, 74, 40);
  const disclaimerText = doc.splitTextToSize(
    result.disclaimer ||
      'Drishti is an AI-assisted universal design evaluation tool designed for awareness and education. It does not replace formal certified ADA/WCAG architectural compliance audits or direct lived-experience stakeholder reviews.',
    contentWidth - 12
  );
  doc.text(disclaimerText, margin + 6, cursorY + 11);

  // 8. Add Page Footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 135, 125);
    doc.text(
      `Generated by Drishti Universal Accessibility Lens • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Save the PDF
  const cleanName = (result.imageName || 'drishti_audit')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  doc.save(`drishti_accessibility_audit_${cleanName}.pdf`);
};
