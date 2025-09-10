import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CertificateData } from "@/types";

export async function generateCertificatePDF(
  elementId: string,
  _filename: string
): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Certificate element not found");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
  });

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 297; // A4 landscape width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  return Promise.resolve(pdf.output("blob") as Blob);
}

export function downloadCertificate(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function createCertificateTemplate(data: CertificateData): string {
  return `
    <div style="
      width: 800px;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
      font-family: 'Times New Roman', serif;
      position: relative;
      border: 10px solid #fff;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
    ">
      <div style="border: 3px solid #fff; padding: 40px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
        <h1 style="font-size: 48px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          Certificate of Achievement
        </h1>
        
        <div style="font-size: 24px; margin: 30px 0;">
          This certifies that
        </div>
        
        <div style="font-size: 36px; font-weight: bold; margin: 20px 0; text-decoration: underline;">
          ${data.recipientName}
        </div>
        
        <div style="font-size: 24px; margin: 30px 0;">
          has successfully completed
        </div>
        
        <div style="font-size: 32px; font-weight: bold; margin: 20px 0; font-style: italic;">
          ${data.courseName}
        </div>
        
        <div style="font-size: 20px; margin: 30px 0;">
          with a score of <strong>${data.score}%</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 60px; font-size: 18px;">
          <div>
            <div>Date: ${data.completionDate}</div>
          </div>
          <div>
            <div>${data.instructorName}</div>
            <div style="border-top: 1px solid #fff; margin-top: 5px; padding-top: 5px;">
              Instructor, ${data.organizationName}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
