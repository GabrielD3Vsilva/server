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

module.exports = routes;