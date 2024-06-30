const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://gbrieloliveira264:1981abcd.@cluster0.9eer0tk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(( )=>console.log('mongoDb Connected'))
.catch((error)=>console.log(error));

const UserSchema = mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        isAdm: Boolean,
        isProfissional: Boolean,
        Skills: String,
        aprove: Boolean,
        photo: String,
        number: Number
    }
)

module.exports = {User: mongoose.model('User', UserSchema)}
