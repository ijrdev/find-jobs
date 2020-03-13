const puppeteer      = require('puppeteer');
const jobsRepository = require('./repositories/jobs-repository');
const sendEmail      = require('sendmail');

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
        
        // Vagas a serem pesquisadas.
        const arrVagas = [
            'vendedor',
            'analista',
            'assistente',
        ];

        console.log('FIND JOBS STARTED...');

        // Loop do qual irá buscar pelas vagas de acordo com as tags.
        for(const job of arrVagas)
        {   
            // Colhendo os dados coletados das vagas dos sites.
            const empregosPE     = await siteEmpregosPE(browser, job);
            const informeVagasPE = await siteInformeVagasPE(browser, job);






            // AJUSTAR A FUNCAO validateData() POIS ESTÁ TRAZENDO SEMPRE UM ARRAY VAZIO.
            // AJUSTAR AS QUERY SELECTOR QUE BUSCA AS VAGAS DOS SITES, DEIXAR MAIS CLEAN E DIRETA.







            const data = await validateData(empregosPE, informeVagasPE);
            
            // if(data != undefined && data != null && data != false && data != '')
            // {
            //     for(const value of data) 
            //     {
            //         if(value.title != '' && value.email != '')
            //         {
            //             const findEmail = await jobsRepository.getJob({email: value.email});

            //             if(findEmail == undefined || findEmail == null || findEmail == false || findEmail == '')
            //             {
            //                 await jobsRepository.addJob(value);
            //             }
            //         }
            //     }
            // }
        }

        console.log('END.');

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
    var arrData    = [];
    var arrAxiliar = [];

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
        arrAxiliar.concat(data1, data2);

        for(const item of arrAxiliar) 
        {
            console.log('DENTRO')
            console.log(item)
            if(arrAxiliar.indexOf(item) == -1) 
            console.log('ADD')
            console.log(item)
                arrData.push(item);
        }
    }

    return arrData;
};

const findJobs = async (browser, arrVagas) => {
    
}

const email = () => {
    
}