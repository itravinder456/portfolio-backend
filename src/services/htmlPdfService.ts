import puppeteer, { Browser } from "puppeteer";
import { Response } from "express";

/**
 * Generate PDF from HTML and send as HTTP response.
 */
export async function generatePdfFromHtml(
  html: string,
  res: Response,
  filename = "resume.pdf"
) {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", bottom: "18mm", left: "15mm", right: "15mm" },
    });

    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Length", String(pdfBuffer.length));
      res.status(200).end(pdfBuffer);
    }
  } catch (err) {
    console.error("generatePdfFromHtml error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.warn("Error closing puppeteer:", closeErr);
      }
    }
  }
}
