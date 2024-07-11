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


routes.post('/add', async(req, res)=> { 
    const {idProfissional} = req.body; 
    console.log(idProfissional); 
    const adm = await db.User.find( );

    
    for(let i = 0; i < adm.length; i++) {
        if(adm[i].isAdm == true) {
            await db.User.updateOne({_id: adm[i].id},{$push: {list: idProfissional}})
            return
        }
    }
})


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
    



module.exports = routes;