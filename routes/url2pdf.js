let express = require('express');
let router = express.Router();
const puppeteer = require('puppeteer');
const api_key = process.env.PDF_API_KEY

/* GET home page. */
router.post('/', async function(req, res, next) {

    if(req.query.api_key !== api_key) return res.sendStatus(403);

    let url = req?.body?.url ?? 'http://www.columbia.edu/~fdc/sample.html';

    // Chrome init
    const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});

    // neuer Tab
    const page = await browser.newPage();

    // Seite öffnen
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // PDF erzeugen
    const pdf = await page.pdf({
        preferCSSPageSize: true,
        displayHeaderFooter: true,
    });

    // Aufräumen
    await page.close();
    await browser.close();

    // PDF downloaden
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length }).send(pdf)
});

module.exports = router;
