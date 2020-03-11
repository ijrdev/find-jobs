const puppeteer = require('puppeteer');

// Módulos dos sites.
const siteEmpregosPE     = require('./src/empregospe');
const siteInformeVagasPE = require('./src/informevagaspe');
const jobsRepository     = require('./repositories/vagas-repository');
const job                = process.argv.slice(2);

const run = async () => {
    try
    {
        // Carrega o launch do puppeteeer.
        // Dentro do launch é onde seta as configurações do puppeteer.
        const browser = await puppeteer.launch({
            headless: true,
            // slowMo: 250
        }); 
        
        // Colhendo os dados coletados das vagas dos sites.
        const empregosPE     = await siteEmpregosPE(browser, job);
        const informeVagasPE = await siteInformeVagasPE(browser, job);

        const data = await validateData(empregosPE, informeVagasPE);

        // const vagas = await jobsRepository.getJobs();

        console.log(data);

        await browser.close();
        await process.exit();
    }
    catch(error) 
    {
        console.log(error);

        await browser.close();
        await process.exit();
    }
}

run();

const validateData = (data1, data2) => {
    var arrData = [];

    // Validando os dados pegos da busca.
    if(data1 && !data2)
    {
        arrData = data1;
    }

    if(data2 && !data1)
    {
        arrData = data2;
    }
        
    if(!data1 && !data2)
    {
        arrData = null;
    }
    
    if(data1 && data2)
    {
        arrData = data1.concat(data2);
    }

    return arrData;
};