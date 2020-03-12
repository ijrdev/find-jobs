const puppeteer      = require('puppeteer');
const jobsRepository = require('./repositories/jobs-repository');
const job            = process.argv.slice(2);

// Módulos dos sites.
const siteEmpregosPE     = require('./src/empregospe');
const siteInformeVagasPE = require('./src/informevagaspe');

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





        // VALIDAR AMBOS OS ARRAYS COM OS DADOS, 
        // POIS SE TIVER A VAGA EM UM SITE E O OUTRO TBM IRÁ REGISTRAR DUPLICATA
        // CRIAR COLLECTION DE KEY_JOBS(CHAVES DAS VAGAS)

        const data = await validateData(empregosPE, informeVagasPE);







        if(data != undefined && data != null && data != false && data != '')
        {
            for(let value of data) 
            {
                if(value.title != '' && value.email != '')
                {
                    const findEmail = await jobsRepository.getJob({email: value.email});

                    if(findEmail == undefined || findEmail == null || findEmail == false || findEmail == '')
                    {
                        await jobsRepository.addJob(value);
                    }
                }
            }
        }

        console.log('OK!');

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
        arrData = [];
    }
    
    if(data1 && data2)
    {
        arrData = data1.concat(data2);
    }

    return arrData;
};