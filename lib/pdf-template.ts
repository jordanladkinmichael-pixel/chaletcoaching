/**
 * Compact HTML Template for PDF Generation
 * Optimized for maximum 4 pages
 */

export interface PDFTemplateData {
  title: string;
  createdAt: Date;
  weeks: number;
  sessionsPerWeek: number;
  workoutTypes: string[];
  targetMuscles: string[];
  injurySafe: boolean;
  specialEquipment: boolean;
  nutritionTips: boolean;
  formattedContent: string;
  nutritionAdvice?: string | null;
  imagesHtml?: string;
}

/**
 * Generate compact HTML template for PDF (max 4 pages)
 */
export function generatePDFTemplate(data: PDFTemplateData): string {
  const {
    title,
    createdAt,
    weeks,
    sessionsPerWeek,
    workoutTypes,
    targetMuscles,
    injurySafe,
    specialEquipment,
    nutritionTips,
    formattedContent,
    nutritionAdvice,
    imagesHtml = "",
  } = data;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.3;
      color: #1a1a1a;
      background: #ffffff;
      padding: 8mm;
    }
    
    /* Header - Ultra Compact */
    .header {
      border-bottom: 1px solid #D9F99D;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #0E0E10;
      margin-bottom: 2px;
      line-height: 1.2;
    }
    
    .subtitle {
      font-size: 9px;
      color: #6b7280;
      margin-bottom: 6px;
    }
    
    /* Info Grid - Ultra Compact */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px;
      margin-bottom: 8px;
      font-size: 9px;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    
    .info-value {
      color: #0E0E10;
      font-weight: 600;
    }
    
    /* Content Sections - Ultra Compact */
    .content-section {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    
    .content-section h2 {
      font-size: 13px;
      font-weight: 700;
      color: #0E0E10;
      margin-bottom: 6px;
      padding-bottom: 3px;
      border-bottom: 1px solid #D9F99D;
      line-height: 1.3;
    }
    
    .content-section h3 {
      font-size: 11px;
      font-weight: 600;
      color: #374151;
      margin-top: 6px;
      margin-bottom: 3px;
      line-height: 1.3;
    }
    
    /* Tables - Ultra Compact */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 9px;
    }
    
    table th {
      background: #f3f4f6;
      padding: 4px 6px;
      text-align: left;
      font-weight: 600;
      border: 1px solid #d1d5db;
      font-size: 9px;
      line-height: 1.2;
    }
    
    table td {
      padding: 3px 6px;
      border: 1px solid #e5e7eb;
      vertical-align: top;
      line-height: 1.3;
    }
    
    table tr:nth-child(even) {
      background: #f9fafb;
    }
    
    /* Lists - Ultra Compact */
    ul {
      margin-left: 12px;
      margin-bottom: 6px;
    }
    
    li {
      margin-bottom: 2px;
      font-size: 10px;
      line-height: 1.3;
    }
    
    p {
      margin-bottom: 4px;
      font-size: 10px;
      line-height: 1.3;
    }
    
    /* Images - Ultra Compact */
    .images-section {
      margin-bottom: 8px;
    }
    
    .image-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      margin-top: 6px;
    }
    
    .course-image {
      width: 100%;
      height: auto;
      max-height: 120px;
      object-fit: cover;
      border-radius: 3px;
      border: 1px solid #e5e7eb;
    }
    
    /* Nutrition Section */
    .nutrition-section {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 4px;
      padding: 8px;
      margin-top: 12px;
      page-break-inside: avoid;
    }
    
    .nutrition-section h3 {
      color: #166534;
      font-size: 12px;
      margin-bottom: 6px;
    }
    
    .nutrition-section ul {
      margin-left: 16px;
    }
    
    .nutrition-section li {
      color: #166534;
      font-size: 10px;
    }
    
    /* Footer - Compact */
    .footer {
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 9px;
      color: #6b7280;
    }
    
    /* Print Optimization */
    @media print {
      body {
        padding: 5mm;
      }
      
      .page-break {
        page-break-after: always;
      }
      
      .no-break {
        page-break-inside: avoid;
      }
    }
    
    /* Overview Section - Ultra Compact */
    .overview {
      background: #f9fafb;
      border-left: 2px solid #D9F99D;
      padding: 6px 10px;
      margin-bottom: 8px;
      font-size: 10px;
      line-height: 1.3;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="title">${escapeHtml(title)}</div>
    <div class="subtitle">Generated on ${formatDate(createdAt)} • ${weeks} weeks • ${sessionsPerWeek} sessions/week</div>
  </div>
  
  <!-- Program Info -->
  <div class="info-grid">
    <div class="info-item">
      <span class="info-label">Duration:</span>
      <span class="info-value">${weeks} weeks</span>
    </div>
    <div class="info-item">
      <span class="info-label">Sessions/week:</span>
      <span class="info-value">${sessionsPerWeek}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Workout Types:</span>
      <span class="info-value">${workoutTypes.slice(0, 2).join(", ")}${workoutTypes.length > 2 ? "..." : ""}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Focus:</span>
      <span class="info-value">${targetMuscles.slice(0, 2).join(", ")}${targetMuscles.length > 2 ? "..." : ""}</span>
    </div>
    ${injurySafe ? `
    <div class="info-item">
      <span class="info-label">Safety:</span>
      <span class="info-value">Injury-safe modifications</span>
    </div>
    ` : ""}
    ${specialEquipment ? `
    <div class="info-item">
      <span class="info-label">Equipment:</span>
      <span class="info-value">Special equipment required</span>
    </div>
    ` : ""}
  </div>
  
  ${imagesHtml ? `
  <!-- Images -->
  <div class="content-section images-section">
    <h2>Program Visuals</h2>
    <div class="image-grid">
      ${imagesHtml}
    </div>
  </div>
  ` : ""}
  
  <!-- Main Content -->
  <div class="content-section">
    ${formattedContent}
  </div>
  
  ${nutritionTips && nutritionAdvice ? `
  <!-- Nutrition Section -->
  <div class="content-section nutrition-section no-break">
    <h3>Nutrition Tips</h3>
    ${formatNutritionAdvice(nutritionAdvice)}
  </div>
  ` : ""}
  
  <!-- Footer -->
  <div class="footer">
    <p>Generated by Chaletcoaching • Always consult a healthcare professional before starting any new fitness program</p>
  </div>
</body>
</html>`;
}

/**
 * Format nutrition advice into HTML list
 */
function formatNutritionAdvice(advice: string): string {
  // Split by newlines or bullet points
  const lines = advice
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const items = lines.map((line) => {
    // Remove markdown bullets if present
    const cleaned = line.replace(/^[-*•]\s*/, "");
    return `<li>${escapeHtml(cleaned)}</li>`;
  });

  return `<ul>${items.join("")}</ul>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

