// Development check only: uses the bundled Playwright installation or NODE_PATH.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

(async () => {
  const root = path.resolve(__dirname, '..');
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.pdf': 'application/pdf', '.svg': 'image/svg+xml', '.png': 'image/png' };
  const server = http.createServer((req, res) => {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    const output = path.resolve(process.env.PORTFOLIO_QA_DIR || path.join(root, 'tmp', 'qa'));
    fs.mkdirSync(output, { recursive: true });
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('main').count(), 1, 'One main landmark required');
      assert.equal(await page.locator('h1').count(), 1, 'One primary heading required');
      assert(await page.locator('h1').isVisible(), 'Content must render immediately');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert(!overflow, `Horizontal overflow at ${width}px`);
      const invalidAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash));
      assert.deepEqual(invalidAnchors, [], 'All anchor links resolve');
      await page.screenshot({ path: path.join(output, `portfolio-${width}.png`), fullPage: true });
      if (width === 390) {
        for (const section of ['student-performance', 'fact-checking', 'landroid', 'about', 'contact']) {
          await page.locator('#' + section).screenshot({ path: path.join(output, `mobile-${section}.png`) });
        }
      }
      console.log(`PASS layout, landmarks and anchors: ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    assert(await toggle.isVisible(), 'Mobile menu toggle visible');
    await toggle.focus();
    await page.keyboard.press('Enter');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Work');
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert(await toggle.evaluate(el => el === document.activeElement), 'Escape returns focus');
    await toggle.click();
    await page.locator('#primary-navigation').getByRole('link', { name: 'About', exact: true }).click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'about');
    await toggle.click();
    await page.setViewportSize({ width: 1024, height: 900 });
    assert(await page.locator('#primary-navigation').getByRole('link', { name: 'Work', exact: true }).isVisible());
    console.log('PASS mobile keyboard, Escape, anchor focus and desktop resize');
    const resume = await page.request.get(url + '/Ujjwal_Shukla_Resume_latest.pdf');
    assert.equal(resume.status(), 200);
    assert((await resume.body()).subarray(0, 4).toString() === '%PDF');
    for (const asset of ['/assets/favicon.svg', '/assets/social-preview.png', '/styles.css', '/main.js']) {
      assert.equal((await page.request.get(url + asset)).status(), 200, `${asset} accessible`);
    }
    assert.equal(await page.locator('a[href="mailto:shuklaujjwal.work@gmail.com"]').count() > 0, true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
    const fallback = await noJs.newPage();
    await fallback.goto(url);
    for (const name of ['Work', 'About', 'Contact']) assert(await fallback.locator('#primary-navigation').getByRole('link', { name, exact: true }).isVisible(), `${name} accessible without JS`);
    assert.equal(await fallback.locator('article.project').count(), 3);
    assert.notEqual(await fallback.locator('.site-header').evaluate(el => getComputedStyle(el).position), 'sticky', 'Expanded no-JS navigation must not obscure anchor targets');
    await fallback.screenshot({ path: path.join(output, 'portfolio-no-js.png'), fullPage: true });
    await noJs.close();
    await page.setViewportSize({ width: 360, height: 800 });
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    console.log('Enlarged-text overflow elements:', await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 && r.width > 0; }).map(el => ({ tag: el.tagName, class: el.className, right: Math.round(el.getBoundingClientRect().right) })).slice(0, 20)));
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'No overflow at 200% text');
    await page.locator('.hero-actions .button').click();
    await page.waitForFunction(() => Math.abs(document.getElementById('work').getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)) < 2);
    assert(await page.evaluate(() => document.getElementById('work').getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom), 'Enlarged header must not obscure anchor targets');
    assert.deepEqual(errors, [], 'No browser errors');
    console.log('PASS PDF, contact, reduced motion, no-JS, 200% text and console checks');
    console.log(`Screenshots: ${output}`);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
