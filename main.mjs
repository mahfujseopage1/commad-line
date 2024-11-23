import express from 'express';
import { runCommand } from './index.mjs';
import { trackModuleData } from './trackModuleData.mjs';
import { formatHttp } from './others.mjs';
import cors from 'cors';
import { takeScreenshot } from './takeScreenshot.mjs';
import { laravelCpuUse } from './laravelCpuUse.mjs';
const app = express();
import notifier from 'node-notifier';


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Command Server Is running', status: 200 });
});

app.get('/run-command', (req, res) => {
  runCommand();
  res.json({ message: 'SonarQube scanning started', status: 200 });
});
app.get('/check-link', (req, res) => {
  const data = formatHttp("wht ai this eatlightwithnat.com")
  res.json({ message: 'SonarQube scanning started', status: 200, data: data });
});
app.get('/get-module-file-track', async (req, res) => {
  const data = await trackModuleData();
  console.log(data)
  res.json({ message: 'File Tracked Successfully', status: 200, data: data });
});
app.get('/get-module-file-track', async (req, res) => {
  const data = await trackModuleData();
  console.log(data)
  res.json({ message: 'File Tracked Successfully', status: 200, data: data });
});
app.get('/laravel-cpu', async (req, res) => {
  laravelCpuUse()
  res.json({ message: 'Cpu Tracking Started', status: 200, });
});

// Reverse proxy route

// app.get('/proxy', async (req, res) => {
//   const url = req.query.url; // Pass the external URL as a query parameter

//   if (!url) {
//     return res.status(400).send('Missing URL parameter');
//   }

//   try {
//     // Launch Puppeteer
//     const browser = await puppeteer.launch({
//       headless: false,

//     });
//     const page = await browser.newPage();

//     // Go to the URL
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Get the page content
//     const pageContent = await page.content();

//     // Close the browser
//     await browser.close();

//     // Send the HTML content to the client
//     res.send(pageContent);
//   } catch (error) {
//     console.error('Error scraping the page:', error);
//     res.status(500).send('Error scraping the page');
//   }
// });


app.post('/take-screenshot', async (req, res) => {
  const body = req.body
  const data = await takeScreenshot(body);
  console.log(data)
  res.json({ message: 'Screenshot taken', status: 200, data: data });
})



setInterval(() => {
  runCommand();
}, 18000000);

setInterval(() => {
  laravelCpuUse();
}, 100000); 

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});