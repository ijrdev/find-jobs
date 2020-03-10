const puppeteer = require('puppeteer');

// Módulos dos sites.
// const siteEmpregosPE = require('./src/empregospe');
// const siteInformeVagasPE = require('./src/informevagaspe');

const run = async () => {
    try
    {
        // Carrega o launch do puppeteeer.
        // Dentro do launch é onde seta as configurações.
        const browser = await puppeteer.launch({
            headless: false,
            // slowMo: 250
        }); 

        // const empregosPE = await siteEmpregosPE(browser);

        // console.log(empregosPE);

        const ivPE = await informeVagasPE(browser);
        
        await browser.close(); 
    }
    catch(error) 
    {
        console.log(error);

        await browser.close();
    }
}

run();

// Função principal do qual administra e acessa determinado link.
const informeVagasPE = async (browser) => {
    const page = await browser.newPage();
    page.setViewport({width: 0, height: 0});

    var arrLinks = [];

    // Passando os parâmetros necessários para realizar o scraping e chamando a função resposável por realizar a busca dos links da vaga filtrada.
    const pagina = await getLinks(page, 'https://informevagaspe.blogspot.com', '#main');

    // Validando os links pegos da busca.
    if(!pagina)
    {
        return [];
    }

    console.log(pagina);

    // var arrData = [];

    // // Acessando os links colhidos das vagas e buscando informações.
    // if(arrLinks != undefined && arrLinks != null && arrLinks != false && arrLinks != '')
    // {
    //     for(const link of arrLinks) {
    //         arrData.push(await getData(page, link, '#mainContent'));
    //     }
    // }
};

// Função do qual pega os links relacionados a vaga escolhida.
const getLinks = async (page, site, selector) => {
    await page.goto(site);
    await page.waitForSelector(selector);

    // Lógica para pegar os links. 
    return await page.evaluate(() => {
        const elements    = document.querySelectorAll('#main .hfeed .wrapfullpost .hentry h3 a');
        const arrElements = [];

        for(let element of elements) 
        {
            const e = element.getAttribute('href').trim();

            if(e.indexOf('auxiliar') != -1)
            {
                arrElements.push(e);
            }

            if(arrElements.length == 10)
            {
                return arrElements;
            }
        }

        if(arrElements != undefined && arrElements != null && arrElements != false && arrElements != '')
        {
            return arrElements;
        }

        return false;
    });
};

// Função responsável por acessar os links pegos e colher informações das vagas.
const getData = async (page, site, selector) => {
    await page.goto(site);
    await page.waitForSelector(selector);

    // Pegando os dados da vaga.
    return await page.evaluate(() => {
        const title = document.querySelector('.section_header h1').innerText.trim();
        const email = document.querySelector('#apply p a').getAttribute('href').trim();

        return {title: title, email: email};
    });
}

