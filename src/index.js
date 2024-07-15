const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const prompt = require("prompt-sync")()
const fs = require("fs")

function WebScrapper() {
    this.getHtml = async () => {
        const userUrl = prompt("Cole a URL de um produto da Netshoes para realizar a extração de dados: ")
        if (!userUrl) return ""
        console.log("Aguarde...")
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(userUrl, { waitUntil: 'networkidle0' })
        await page.setViewport({width: 1080, height: 1024});
        await page.waitForFunction("window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500")
        const html = await page.content()
        await browser.close()

        return html
    }
    this.getData = async () => {
        const html = await this.getHtml()
        if (!html) return console.log("URL inválida")
        const $ = cheerio.load(html)
        const titulo = $(".product-name").text().trim()
        const preco = $(".saleInCents-value").first().text().trim()
        const imagem = $(".zoom-image").attr("src")
        const descricao = $(".features--description").text().trim()

        const resultado = `Informações do produto: \nTítulo: ${titulo} \nPreço: ${preco}\nImagem: ${imagem} \nDescrição: ${descricao}`

        console.log(resultado)
        fs.writeFile("./resultado/resultado.txt", resultado, error => {
            if (error) console.log("Erro ao criar arquivo de resultado")
        })
    }
}

const scrapper = new WebScrapper()
scrapper.getData()