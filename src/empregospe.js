// Função principal do qual administra e acessa determinado link.
const empregosPE = async (browser, job) => {
    // Abrindo uma página.
    // É possível também setar configurações para a página.
    const page = await browser.newPage();
    page.setViewport({width: 0, height: 0});

    // Passando os parâmetros necessários para realizar o scraping e chamando a função resposável por realizar a busca dos links da vaga filtrada.
    const pagina = await getLinks(job, page, 'http://www.empregospernambuco.com.br/jobs', '#mainContent');

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
            arrData.push(await getData(page, link, '#mainContent'));
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
        const elements    = document.querySelectorAll('ol li .job-title h3 a');
        const arrElements = [];

        for(let element of elements) 
        {
            const e = element.getAttribute('href').trim();

            if(e.indexOf(job) != -1)
            {
                arrElements.push(e);
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
        const title = document.querySelector('.section_header h1') != null ? document.querySelector('.section_header h1').innerText.trim() : '';
        const email = document.querySelector('#apply p a') != null ? document.querySelector('#apply p a').innerText.trim().toLowerCase() : '';

        return {title: title, email: email, site: 'EMPREGOSPE'};
    });
}

module.exports = empregosPE;