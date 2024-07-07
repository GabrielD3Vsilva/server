const db = require("../Db/db");

async function getLoginData (req, res) {
    const  {email, password} = req.body;

    try {
        const userInDb = await db.User.find({
            email: email,
            password: password
        });

        if(userInDb.length > 0) {
            return res.status(200).json(
                {
                    name: userInDb[0].name,
                    isAdm: userInDb[0].isAdm, 
                    isProfissional: userInDb[0].isProfissional
                });
        } else {
            return res.status(400).json({message: "usuário não encontrado"});
        }
    } catch (error){
        console.error(error);
    }
}


module.exports = {
    getLoginData
};