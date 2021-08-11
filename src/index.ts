import puppeteer from 'puppeteer';

function fromCorreios(cep: string) {
    (async () => {
        const browser = await puppeteer.launch();
        const initialPage = await browser.newPage();
        await initialPage.goto('https://www.correios.com.br/');
        const pageTarget = initialPage.target();
        await initialPage.click('div[id=carol-fecha]');
        await initialPage.waitForSelector('input[name=relaxation]');
        await initialPage.$eval(
            'input[name=relaxation]',
            (el: any, cep) => (el.value = cep),
            cep
        );
        await initialPage.click('input[name=relaxation]');
        await initialPage.keyboard.press('Enter');
        const newTarget = await browser.waitForTarget(
            (target) => target.opener() === pageTarget
        );
        const cepPage = await newTarget.page();
        if (cepPage) {
            await cepPage.waitForSelector('tbody tr td');
            const text = await cepPage.evaluate(() => {
                const tds = Array.from(
                    document.querySelectorAll('tbody tr td')
                );
                return tds.map((td: any) => td.innerText);
            });
            console.log(showData(text));
        }
        await browser.close();
    })();
}

function fromBuscaCepInterCorreios(cep: string) {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(
            'https://buscacepinter.correios.com.br/app/endereco/index.php'
        );
        await page.waitForSelector('input[id=endereco]');
        await page.$eval(
            'input[id=endereco]',
            (el: any, cep) => (el.value = cep),
            cep
        );
        await page.click('button[name="btn_pesquisar"]');
        await page.waitForSelector('tbody tr td');
        const text = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('tbody tr td'));
            return tds.map((td: any) => td.innerText);
        });
        console.log(showData(text));
        await browser.close();
    })();
}

function showData(data: string[]): string {
    return `Nome/Logradouro: ${data[0]}, Bairro/Distrito: ${data[1]}, Localidade/UF: ${data[2]}, CEP: ${data[3]}`;
}

fromCorreios('95940000');
fromBuscaCepInterCorreios('95940000');
