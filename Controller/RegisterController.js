const db = require('../Db/db');
const nodemailer = require('nodemailer');

async function getRegisterData (req, res) {
    const {name, email, password, confirmPassword} = req.body;
    const isEqual = validateIfPasswordsIsEqual(password, confirmPassword);

    if(isEqual){
        const exists = await validateIfUserExists(email);

        if(!exists){
            await createUser(name, email, password);
            return res.status(200).json({message: "OK!"});
        }

        return res.status(404).json({message: 'erro'});

    }
    return res.status(400).json({message: "erro"});

}

async function getRegisterDataToWork (req, res) {
    const {name, email, password, confirmPassword, skills, photo, number} = req.body;
    const isEqual = validateIfPasswordsIsEqual(password, confirmPassword);
    if(isEqual){
        const exists = await validateIfUserExists(email);

        if(!exists){
            await createUserToWork(name, email, password, skills, photo, number);

            let transporter = nodemailer.createTransport({
                host: "smtp@gmail.com",
                port: 587,
                secure: true,
                auth: {
                    user: 'diasemterapia@gmail.com',
                    pass: '1981abcd.'
                }
            });
            
            // Configure as opções do email
            let mailOptions = {
                from: 'diasemterapia@gmail.com',
                to: 'gabrield3vsilva@gmail.com',
                subject: 'Novo candidato',
                text: 'Olá administrador, tem um novo profissional aguardando sua aprovação!'
            };
            
            // Envie o email
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log('Erro:', error);
                } else {
                    console.log('Email enviado:', info.response);
                }
            });

            return res.status(200).json({message: "OK!"});
        }

        return res.status(404).json({message: 'erro'});

    } 
    return res.status(400).json({message: "erro"});
}

function validateIfPasswordsIsEqual(password, confirmPassword) {
    if(password !== confirmPassword){
        return false;
    }
    return true;
}

async function validateIfUserExists (email) {
    const userInDB = await db.User.find(
        {
            email: email
        }
    );

    if(userInDB.length > 0){
        return true;
    }
    return false;
}

async function createUser (name, email, password) {
   try {
        await db.User.create({
            name: name,
            email: email,
            password: password,
            isAdm: false,
            isProfissional: false
        })
   } catch (error) {
        console.log(error);
   }
}

async function createUserToWork (name, email, password, skills, photo, number) {
    try {
        await db.User.create({
            name: name,
            email: email,
            password: password,
            isAdm: false,
            isProfissional: true,
            Skills: skills,
            aprove: false,
            photo: photo,
            number: number,
            vip: false
        });
   } catch (error) {
        console.log(error);
   }
}

async function getProfissionals (req, res) {
    const profissionals = await db.User.find({
        isProfissional: true,
        aprove: false   
    });

    console.log(profissionals)

    res.status(200).json(profissionals);
}

async function getDetails (req, res) {
    const {id} = req.body;

    try {
        const details = await db.User.find({
            _id: id
        });

        console.log(details);

        res.send(details);
    } catch (error){
        console.log(error);
    }

}

async function getProfissionalsAproved (req, res) {
    const profissionals = await db.User.find({
        isProfissional: true,
        aprove: true
    });

    console.log(profissionals)

    res.status(200).json(profissionals);
}

module.exports = {
    getRegisterData,
    getRegisterDataToWork,
    getProfissionals,
    getDetails,
    getProfissionalsAproved
}