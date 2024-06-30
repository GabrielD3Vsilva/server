const db = require('../Db/db');

async function aprove (req, res) {
    const {id} = req.body;

    console.log(id);

    try {
        await db.User.updateOne(
            {
                _id: id
            }, 
            {
                aprove: true
            });

            res.status(200).json({message: 'ok'})
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function reprove (req, res) {
    const {id} = req.body;

    console.log(id);

    try {
        await db.User.deleteOne({ _id: id });
        res.status(200).json({ message: 'ok' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    aprove,
    reprove
}