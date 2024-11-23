
import puppeteer from 'puppeteer';


export const takeScreenshot = async (body) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: body?.width || 1200,
        height: body?.height || 800,
      },
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security", // For cross-origin handling
      ],
    });
    const page = await browser.newPage();
    await page.goto(body.url, { waitUntil: 'networkidle2' });
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    const screenshotBuffer = await page.screenshot({ fullPage: true, path: `screenshot${body.id}.png` });
    return screenshotBuffer;
  } catch (error) {
    console.error("Error taking screenshot:", error);
  }
};
