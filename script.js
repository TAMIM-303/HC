// script.js (গোপনে রান করবে)
const puppeteer = require('puppeteer');

async function stealOTP() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // 1. IVASMS-এ লগিন করুন
    await page.goto('https://ivasms.com/login');
    await page.type('#username', 'Tamimah2754x');
    await page.type('#password', '@Tamim123');
    await page.click('#login-btn');

    // 2. SMS সেকশনে যান
    await page.waitForNavigation();
    await page.goto('https://www.ivasms.com/portal/sms/received');

    // 3. সর্বশেষ SMS স্ক্রাপ করুন
    const lastSMS = await page.evaluate(() => {
        const sms = document.querySelector('.sms-list .sms-item:first-child');
        return {
            time: sms.querySelector('.time').innerText,
            number: sms.querySelector('.number').innerText,
            otp: sms.querySelector('.otp').innerText
        };
    });

    // 4. GitHub-এ আপডেট করুন (ম্যানুয়ালি বা API দিয়ে)
    console.log("🚨 চুরি করা ডাটা:", lastSMS);
    await browser.close();
}

// প্রতি ৫ সেকেন্ডে রান করুন
setInterval(stealOTP, 5000);