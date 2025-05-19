// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

// SMS ডাটা স্টোর করার জন্য
let allSMS = [];

async function fetchLatestSMS() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // IVASMS-এ লগইন
    await page.goto('https://www.ivasms.com/login');
    await page.type('#username', 'Tamimah2754x');
    await page.type('#password', '@Tamim1227');
    await page.click('#login-btn');
    await page.waitForNavigation();

    // SMS রিসিভ্ড পেজে যান
    await page.goto('https://www.ivasms.com/portal/sms/received');
    
    // Get Code ক্লিক করুন
    await page.click('.get-code-btn');
    await page.waitForTimeout(2000);
    
    // রেঞ্জ সিলেক্ট করুন (প্রথমটি সিলেক্ট করছে)
    await page.click('.range-item:first-child');
    await page.waitForTimeout(3000);
    
    // সর্বশেষ SMS সংগ্রহ করুন
    const latestSMS = await page.evaluate(() => {
      const smsList = document.querySelectorAll('.sms-item');
      const lastSMS = smsList[smsList.length - 1];
      return {
        number: lastSMS.querySelector('.number').innerText,
        code: lastSMS.querySelector('.code').innerText,
        time: new Date().toLocaleString()
      };
    });
    
    // অ্যারে আপডেট করুন (পুরাতন ডাটা রেখে নতুন যোগ করুন)
    allSMS.unshift(latestSMS);
    if(allSMS.length > 50) allSMS.pop(); // সর্বোচ্চ ৫০টি ডাটা রাখুন
    
    return allSMS;
  } finally {
    await browser.close();
  }
}

// API এন্ডপয়েন্ট
app.get('/api/sms', async (req, res) => {
  try {
    const smsData = await fetchLatestSMS();
    res.json(smsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
