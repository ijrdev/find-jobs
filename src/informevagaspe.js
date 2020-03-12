// Função principal do qual administra e acessa determinado link.
const informeVagasPE = async (browser, job) => {
    const page = await browser.newPage();
    page.setViewport({width: 0, height: 0});

    // Passando os parâmetros necessários para realizar o scraping e chamando a função resposável por realizar a busca dos links da vaga filtrada.
    const pagina = await getLinks(job, page, 'https://informevagaspe.blogspot.com', '#main');

    // Validando os links pegos da busca.
    if(!pagina)
    {
        return [];
    }

    var arrData = [];

    // Acessando os links colhidos das vagas e buscando informações.
    if(pagina != undefined && pagina != null && pagina != false && pagina != '')
    {
        for(const link of pagina) 
        {
            arrData.push(await getData(page, link, '#main-wrapper'));
        }
    }

    return arrData;
};

// Função do qual pega os links relacionados a vaga escolhida.
const getLinks = async (job, page, site, selector) => {
    await page.goto(site);
    await page.waitForSelector(selector);

    // Lógica para pegar os links. 
    return await page.evaluate((job) => {
        const elements    = document.querySelectorAll('#main .hfeed .wrapfullpost .hentry h3 a');
        const arrElements = [];

        for(let element of elements) 
        {
            const e = element.getAttribute('href').trim();

            if(e.indexOf(job) != -1)
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
    }, job);
};

// Função responsável por acessar os links pegos e colher informações das vagas.
const getData = async (page, site, selector) => {
    await page.goto(site);
    await page.waitForSelector(selector);

    // Pegando os dados da vaga.
    return await page.evaluate(() => {
        const title  = document.querySelector('.wrapfullpost h3 a') != null ? document.querySelector('.wrapfullpost h3 a').innerText.trim() : '';
        const email  = document.querySelector('.entry-content div b span') != null ? document.querySelector('.entry-content div b span').innerText.trim().toLowerCase() : document.querySelector('.entry-content div a').innerText.trim().toLowerCase();

        return {title: title, email: email, site: 'INFORMEVAGASPE'};
    });
}

module.exports = informeVagasPE;