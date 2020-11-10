import { Browser } from "puppeteer";


export async function get_stock(browser: Browser, pageURL: string): Promise<boolean | undefined>  { // Check if the item is in stock
    const page = await browser.newPage(); // Creates new page in browser

    try {
        await page.goto(pageURL, { waitUntil: 'domcontentloaded' }); // Goes to product page
        await page.waitForXPath('/html/body/app-root/div/div[1]/app-rz-product/div/product-tab-main/div[1]/div[1]/div[2]/product-main-info/ul/li[1]/p'); // Xpath for Rozetka shop *temprorary measures*
        const elements = await page.$x('/html/body/app-root/div/div[1]/app-rz-product/div/product-tab-main/div[1]/div[1]/div[2]/product-main-info/ul/li[1]/p'); // Gets all elements from Xpath
        if (elements.length === 0) return false; // Check if there's no elements
        const text_of_avaliability = (await page.evaluate((element) => element.textContent, elements[0])).trim(); // Gets first element
        await page.close(); // Closes browser page
        if (['Есть в наличии', 'В наличии'].includes(text_of_avaliability)) return true; // Returns that item is in stock
        return false; // Othervise returns that item is not in stock

    } catch (error) { // Error route
        console.log(`Не удалось открыть страницу: ${pageURL} из-за ошибки: ${error}`); // It's in russian
        await page.close(); // Closes browser page
        return undefined; // Returns not in stock
    }
}
