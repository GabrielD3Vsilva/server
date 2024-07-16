const express = require('express');
const RegisterController = require('../Controller/RegisterController');
const LoginController = require('../Controller/LoginController');
const pagSeguro = require('../Controller/pagSeguro');
const AproveController = require('../Controller/AproveController');
const db = require('../Db/db');


const routes = express.Router( );

routes.post('/register', RegisterController.getRegisterData);
routes.post('/login', LoginController.getLoginData);
routes.post('/planVipPagBank', pagSeguro.AcessVip);
routes.post('/registerToWork', RegisterController.getRegisterDataToWork);
routes.post('/getProfissionals', RegisterController.getProfissionals);
routes.post('/getDetails', RegisterController.getDetails);
routes.post('/aprove', AproveController.aprove);
routes.post('/reprove', AproveController.reprove);
routes.post('/getAproved', RegisterController.getProfissionalsAproved);
routes.post('/consultIds', async (req, res)=>{
    const {emailClient, photo} = req.body;

    const client = await db.User.find(
        {
            email: emailClient
        }
    );

    const profissional = await db.User.find(
        {
            photo: photo
        }
    )

    const obj = {
        client: client,
        profissional: profissional
    }

    res.send(obj);
})

routes.post('/payToConsult', pagSeguro.consult);

routes.post('/atributteVip', async (req, res) => {
    const {email} = req.body;

     await db.User.updateOne(
        {
            email: email
        },
        {
            vip: true
        })

        const user = await db.User.find({
            email: email
        });

    console.log(user)

    res.send('ok');
});

routes.post('/getPayments', async(req, res) => {

    const adm = await db.User.find();

    for(let i = 0; i < adm.length; i++) {
        if(adm[i].isAdm == true) {
            return res.send(adm[i].list);
        }
    }
});


routes.post('/add', async (req, res) => {
    const { idProfissional, idClient } = req.body;
    console.log(idProfissional);
    const adm = await db.User.find();

    for (let i = 0; i < adm.length; i++) {
        if (adm[i].isAdm == true) {
            await db.User.updateOne({ _id: adm[i].id }, { $push: { list: idProfissional } });

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'diasemterapia@gmail.com',
                    pass: '1981abcd.'
                },tls: {
                    rejectUnauthorized: false
                }
            });
            
            // Configure as opções do email
            let mailOptions = {
                from: 'diasemterapia@gmail.com',
                to: 'play.paulo@gmail.com',
                subject: 'Nova consulta',
                text: 'Olá administrador, Tem uma nova consulta aprovada com sucesso! acesse seu paínel para ver mais detalhes.'
            };
            
            // Envie o email
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log('Erro:', error);
                } else {
                    console.log('Email enviado:', info.response);
                }
            });
            break; // Saia do loop após encontrar o administrador
        }
    }

    // Atualize o idProfissional fora do loop

    for( let i = 0; i < adm.length; i++) {
        if(adm[i]._id == idProfissional) {
            await db.User.updateOne({ _id: adm[i].id }, { $push: { list: idProfissional } });


            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'diasemterapia@gmail.com',
                    pass: '1981abcd.'
                },tls: {
                    rejectUnauthorized: false
                }
            });
            
            // Configure as opções do email
            let mailOptions = {
                from: 'diasemterapia@gmail.com',
                to: adm[i].email,
                subject: 'Nova consulta',
                text: 'Olá! Um paciente marcou uma consulta contigo! Veja mais detalhes em seu paínel inicial.'
            };
            
            // Envie o email
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log('Erro:', error);
                } else {
                    console.log('Email enviado:', info.response);
                }
            });

            console.log(adm[i]);
            break
        }

    }

    for( let i = 0; i < adm.length; i++) {
        if(adm[i]._id == idClient) {
            await db.User.updateOne({ _id: adm[i].id }, { $push: { list: idProfissional } });

            console.log(adm[i]);
            break
        }

    }

    


    res.send('Atualização concluída');
});


routes.post('/returnPay', async(req, res) => {
    const {info} = req.body;

    const pay = await db.User.find({
        _id: info
    });

    console.log(pay)

    res.send(pay);
});

routes.post('/deleteItem', async(req, res) => {
    const {id} = req.body;

    const item = await db.User.find( );

    for(let i = 0; i < item.length; i++) {
        if(item[i].isAdm == true) {
            await db.User.updateOne({_id: item[i].id},{$pull: {list: id}});
            break
        }
    }

    res.send('ok');

})


routes.post('/webhook/:idClient/:idProfissional', async (req, res) => {
    const {idClient, idProfissional} = req.params;
    console.log(idClient, idProfissional)
    console.log(req.body);
    // Processar notificação aqui

    try {
        if(req.body.action === "payment.update") {
            res.redirect('https://www.google.com/');
        }
    } catch(error){
        console.log(error)
    }

    res.sendStatus(200); // envia a resposta 200 para o Mercado Pago
});

routes.post('/findMessages', async (req, res) => {
    const item = await db.User.find( );

    for(let i = 0; i < item.length; i++) {
        if(item[i].isAdm == true) {
            return res.send(item);
        }
    }

    
})



  
    



module.exports = routes;