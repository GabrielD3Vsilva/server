const express = require('express');
const RegisterController = require('../Controller/RegisterController');
const LoginController = require('../Controller/LoginController');
const pagSeguro = require('../Controller/pagSeguro');
const AproveController = require('../Controller/AproveController');
const db = require('../Db/db');
const nodemailer = require('nodemailer');


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

    const adm = await db.User.find( );

    for( let i = 0; i < adm.length; i++ ) {
        if( adm[i].isAdm == true ) {
            return res.send(adm[i].list);
        }
    }

    

});

routes.post('/returnPay', async(req, res) => {
    const {info} = req.body;
    const pay = await db.User.find( );

    for( let i = 0; i < pay.length; i++) {
        if(pay[i]._id == info) {
            console.log(pay[i])

            res.send(pay[i])
        }

    }

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



routes.post('/rate', async (req, res)=> {
    const {idProfissional, comment, idClient, note} = req.body;
    let Vnote;
    console.log(idProfissional, comment, idClient, note);
    
    await db.User.updateOne({_id: idProfissional},{$push: {Rates: comment}}).then(console.log('sucesso')).catch((err)=>console.log(err));


    if(note == 'excelente') {
        Vnote = 5
    }

    if(note == 'bom') {
        Vnote = 4
    }

    if(note == 'regular') {
        Vnote = 3
    }

    if(note == 'ruim') {
        Vnote = 2
    }

    await db.User.updateOne({_id: idProfissional},{$push: {notes: Vnote}}).then(console.log('sucesso')).catch((err)=>console.log(err));

    await db.User.updateOne({_id: idProfissional},{$pull: {clients: idProfissional}})

    await db.User.updateOne({_id: idClient},{$pull: {list: idProfissional}})

    const item = await db.User.find({_id: idProfissional});

    console.log(item);

    res.send('ok');
});

routes.post('/comments', async (req, res) => {
    const {photo} = req.body;

    console.log(photo);

    const item = await db.User.find({photo: photo}).then(console.log('ok'));
    console.log(item)
    console.log(item[0].Rates)
    res.send(item[0].Rates);
})


routes.post('/webhook/:idClient/:idProfissional', async (req, res) => {
    const payment = req.query;
    const p = req.body;
    console.log({payment});
    const paymentId = payment.id;
    const {idClient, idProfissional} = req.params;

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer APP_USR-1767806761428068-070620-771a230aa8ff67512387deefe1bd14ef-192552961"
            }
        })

        if(response.ok) {

            const data = await response.json();

            if(data.status == "approved") {
                const paymentProcessed = await db.Payment.findOne({ paymentId: paymentId });

                if (!paymentProcessed) {
                    const clientInDB = await db.User.findOne({ _id: idClient });
                
                    let found = false; // Variável para verificar se o idProfissional foi encontrado
                
                    for (let i = 0; i < clientInDB.clients.length; i++) {
                        if (clientInDB.clients[i] == idProfissional) {
                            found = true; // idProfissional encontrado
                            break; // Saia do loop, pois não precisamos continuar verificando
                        }
                    }
                
                    if (!found) {
                        // idProfissional não está presente, execute as inserções no banco de dados
                        await db.User.updateOne({ isAdm: true }, { $push: { list: idClient } });
                        await db.User.updateOne({ _id: idClient }, { $push: { clients: idProfissional } });
                        await db.User.updateOne({ _id: idProfissional }, { $push: { clients: idClient } });
                        await db.Payment.create({ paymentId: paymentId });

        
                        const client = await db.User.findOne({_id: idClient});
                        const profissional = await db.User.findOne({_id: idProfissional});
                        
                        const items = await db.User.find();

                        for(let i = 0; i < item.length; i++) {
                            if(item[i]._id == idProfissional) {
                                let transporter1 = nodemailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    secure: true,
                                    auth: {
                                        user: 'diasemterapia@gmail.com',
                                        pass: 'jqzq jool jevu kexn'
                                    }
                                });
                    
                                // Configure as opções do email
                                let mailOptions1 = {
                                    from: 'diasemterapia@gmail.com',
                                    to: item[i].email,
                                    subject: 'Nova consulta',
                                    text: 'Olá! Um paciente marcou uma consulta contigo! Veja mais detalhes em seu paínel inicial.'
                                };
                    
                                // Envie o email
                                transporter1.sendMail(mailOptions1, function(error, info){
                                    if (error) {
                                        console.log('Erro:', error);
                                    } else {
                                        console.log('Email enviado:', info.response);
                                    }
                                });
                            } 
                        }

                        let transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'diasemterapia@gmail.com',
                                pass: 'jqzq jool jevu kexn'
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


                        
                    }
                }
                
                return res.sendStatus(200);
                
        }}
    } catch {
        res.sendStatus(500);
    }
});





routes.post('/web/:email', async (req, res) =>{
    const payment = req.query;
    console.log({payment});
    const paymentId = payment.id;
    const {email} = req.params;

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer APP_USR-1767806761428068-070620-771a230aa8ff67512387deefe1bd14ef-192552961"
            }
        });

        if(response.ok) {
            const data = await response.json();

            console.log(data.status);

            if(data.status == "approved") {
                await db.User.updateOne({email: email}, {vip: true});
            }
        }

    } catch {
        console.log(error)
    }
})

module.exports = routes;