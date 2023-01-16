let express = require('express');
let router = express.Router();
const puppeteer = require('puppeteer');
const api_key = process.env.PDF_API_KEY

/* POST html. */
router.post('/', async function(req, res, next) {

    if(req.query.api_key !== api_key) return res.sendStatus(403);

    let html = req?.files?.html?.data?.toString('utf8') ?? '<html><head><title>Test</title></head><body>🤔</body>';

    let header = '<span class="title" style="font-size:10px; margin: 0 auto; text-align: center"></span>'
    let footer = '<span class="pageNumber" style="font-size:10px; margin: 0 auto; text-align: center"></span>'
    // Chrome init
    const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});

    // neuer Tab
    const page = await browser.newPage();

    // HTML laden
    await page.setContent(html);

    // PDF erzeugen
    const pdf = await page.pdf({
        format: 'A4',
        headerTemplate: header,
        footerTemplate: footer,
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
