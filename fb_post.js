require('dotenv').config()
const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 20
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(1000000);
        await page.setViewport({ width: 1000, height: 600 });
        await page.goto('https://www.facebook.com');
        await page.waitForSelector('#email');
        await page.type('#email', 'kravmaguyinfo@gmail.com'); await page.type('#pass', process.env.FB_PASSWORD);
        await page.click(`[type="submit"]`);
        await page.waitForNavigation();
        await page.click(`div`); // this is because facebook leaves some black overlay if you log in with my chromium; it may not be the same for yours
        await page.waitFor(5000)
        await page.goto('https://www.facebook.com/groups/1230356534045928');
        await page.waitFor(3000)
        await page.click('div')

        const button = await findButton(page, "Create a public post…")
        await button.click();
        // await page.waitForSelector(
        //     `[aria-label="What's on your mind?"]`
        // );
        // await page.click(`[aria-label="What's on your mind?"]`);
        // type inside create post
        // await findButton(page, "What's on your mind")
        // console.log('here')
        // await page.click(btn)
        let sentenceList = [
            `this is a group page about commercial real estate for lease`,
        ];

        for (let j = 0; j < sentenceList.length; j++) {
            let sentence = sentenceList[j];
            for (let i = 0; i < sentence.length; i++) {
                await page.keyboard.press(sentence[i]);
                if (i === sentence.length - 1) {
                    await page.waitFor(2000);
                    await page.keyboard.down('Control');
                    await page.keyboard.press(String.fromCharCode(13)); // character code for enter is 13
                    await page.keyboard.up('Control');
                    await page.waitFor(4000);

                    console.log('done');
                    // await page.click(`[aria-label="What's on your mind?"]`);
                    await page.click('div')

                    await button.click();

                }
            }
        }

        console.log('yay we are in facebook logged in');
    } catch (error) {
        console.error(error);
    }
})();

async function findButton(page, buttonName) {
    try {
        const buttons = await page.$$('[role="button"]');
        const regex = new RegExp(buttonName, "i");
        console.log(regex);
        for (const btn of buttons) {
            const valueHandle = await btn.getProperty("innerText");
            let text = await valueHandle.jsonValue();
            if (regex.test(text)) {
                console.log(text);
                return btn;
            }
        }
    } catch (error) {
        console.error(error);
    }
}