const puppeteer      = require('puppeteer');
const jobsRepository = require('./repositories/jobs-repository');
const nodeMailer     = require('nodemailer');

// Módulos dos sites.
const siteEmpregosPE     = require('./src/empregospe');
const siteInformeVagasPE = require('./src/informevagaspe');

const run = async () => {
    try
    {
        console.log('FIND JOBS HAS STARTED...');

        // Carrega o launch do puppeteeer.
        // Dentro do launch é onde seta as configurações do puppeteer.
        const browser = await puppeteer.launch({
            headless: true,
            // slowMo: 250
        }); 

        // Vagas a serem pesquisadas.
        const arrVagas = [
            'telefonia',
            'telemarketing',
            'limpeza',
            'servico',
        ];

        // const startFindJobs = await findJobs(browser, arrVagas);
        // const email         = await sendEmail();

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

    // Validando os dados pegos da busca.
    if(data1)
    {
        for(var item of data1) 
        {
            if(arrData.indexOf(item) == -1) 
            {
                arrData.push(item);
            }
        }
    }

    if(data2)
    {
        for(var item of data2) 
        {
            if(arrData.indexOf(item) == -1) 
            {
                arrData.push(item);
            }
        }
    }

    return arrData;
};

const findJobs = async (browser, arrVagas) => {
    // Loop do qual irá buscar pelas vagas de acordo com as tags.
    for(const job of arrVagas)
    {   
        // Colhendo os dados coletados das vagas dos sites.
        const empregosPE     = await siteEmpregosPE(browser, job);
        const informeVagasPE = await siteInformeVagasPE(browser, job);

        const data = await validateData(empregosPE, informeVagasPE);

        if(data != undefined && data != null && data != false && data != '')
        {
            for(const value of data) 
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
    }
}

const sendEmail = async () => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'ivanildo.m.g.junior@gmail.com',
            pass: 'jr87845838'
        }
    });

    const mailOptions = {
        from: 'ivanildo.m.g.junior@gmail.com',
        to: 'ivanildo.junior.dev@gmail.com',
        subject: 'PRIMEIRO ENVIO DE EMAIL NODEJS.',
        // text: 'AEEEEEEEEEEEEEEEEEEEEE!',
        html: '<h1>tudo ok</h1>'
    };

    const info = await transporter.sendMail(mailOptions);

    // console.log("Message sent: %s", info.messageId);
}