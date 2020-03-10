// Função principal do qual administra e acessa determinado link.
const informeVagasPE = async (browser) => {
    const page = await browser.newPage();
    page.setViewport({width: 0, height: 0});

    var arrLinks = [];

    // Passando os parâmetros necessários para realizar o scraping e chamando a função resposável por realizar a busca dos links da vaga filtrada.
    const pagina1 = await getLinks(page, 'http://www.empregospernambuco.com.br/jobs', '#mainContent');
    const pagina2 = await getLinks(page, 'http://www.empregospernambuco.com.br/jobs/page/2', '#mainContent');

    // Validando os links pegos da busca.
    if(pagina1 && !pagina2)
    {
        arrLinks = pagina1;
    }

    if(pagina2 && !pagina1)
    {
        arrLinks = pagina2;
    }
        
    if(!pagina1 && !pagina2)
    {
        arrLinks = null;
    }
    
    if(pagina1 && pagina2)
    {
        arrLinks = pagina1.concat(pagina2);
    }

    var arrData = [];

    // Acessando os links colhidos das vagas e buscando informações.
    if(arrLinks != undefined && arrLinks != null && arrLinks != false && arrLinks != '')
    {
        for(const link of arrLinks) {
            arrData.push(await getData(page, link, '#mainContent'));
        }
    }

    return arrData;
};

// Função do qual pega os links relacionados a vaga escolhida.
const getLinks = async (page, site, selector) => {
    await page.goto(site);
    await page.waitForSelector(selector);

    // Lógica para pegar os links. 
    return await page.evaluate(() => {
        const elements    = document.querySelectorAll('ol li .job-title h3 a');
        const arrElements = [];

        for(let element of elements) 
        {
            const e = element.getAttribute('href').trim();

            if(e.indexOf('abc') != -1)
            {
                arrElements.push(e);
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

module.exports = empregosPE;