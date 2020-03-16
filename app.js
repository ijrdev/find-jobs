const puppeteer      = require('puppeteer');
const jobsRepository = require('./repositories/jobs-repository');
const nodeMailer     = require('nodemailer');
const dateAndTime    = require('date-and-time');
const args           = process.argv.slice(2);

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
        const arrVagas1 = [
            'edificacoes',
            'estagiario',
            'desenvolvimento',
            'administrativo'
        ];

        const arrVagas2 = [
            'estagio',
            'engenharia',
            'civil',
            'desenvolvedor',
        ];

        // Usuários que serão enviados os emails de acordo com a vaga pretendida.
        const users = [
            {
                email: 'ivanildo.junior.dev@gmail.com',
                jobs: [
                    'estagio',
                    'engenharia',
                    'civil',
                    'desenvolvedor',
                    'edificacoes',
                    'estagiario',
                    'desenvolvimento',
                    'administrativo'
                ]
            },
            {
                email: 'matheusgndematos@gmail.com',
                jobs: [
                    'estagio',
                    'estagiario',
                    'desenvolvedor',
                    'desenvolvimento',
                ]
            },
            {
                email: 'ivanacecilio@hotmail.com',
                jobs: [
                    'edificacoes',
                    'estagio',
                    'estagiario',
                    'civil',
                    'engenharia',
                    'administrativo'
                ]
            },
        ];

        if(args[0] == 'find-jobs-1')
        {
            const startFindJobs = await findJobs(browser, arrVagas1);
        }
        else if(args[0] == 'find-jobs-2')
        {
            const startFindJobs = await findJobs(browser, arrVagas2);
        }
        else if(args[0] == 'email')
        {
            const email = await sendJobs(users);
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

const sendJobs = async (users) => {
    for(const user of users) 
    {
        var arrTags = [];

        for(const job of user.jobs) 
        {
            const getTag = await jobsRepository.getJobs({tag: job, date: dateAndTime.format(new Date(), 'DD/MM/YYYY')});

            if(getTag != undefined && getTag != null && getTag != false && getTag != '')
            {
                var tag = "<h3>"+job.toUpperCase()+"</h3>";

                arrTags.push(tag);
            
                // Tratando os dados trazidos.
                for(const item of getTag) 
                {
                    var vaga = "<strong>Título: </strong>"+item.title+"<br> <strong>Email: </strong>"+item.email+"<br> <strong>Data: </strong>"+item.date+"<br><br>";

                    arrTags.push(vaga);
                }
            }
        }

        if(arrTags != undefined && arrTags != null && arrTags != false && arrTags != '')
        {
            await sendEmail(user.email, arrTags.toString().replace(/,/g, ''));
        }
    }
}

const sendEmail = async (email, vagas) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'ivanildo.m.g.junior@gmail.com',
            pass: ''
        }
    });

    const mailOptions = {
        from: 'ivanildo.m.g.junior@gmail.com',
        to: email,
        subject: 'FIND-JOBS - Envio diário das vagas encontradas.',
        // text: vagas,
        html: vagas
    };

    const info = await transporter.sendMail(mailOptions);
}