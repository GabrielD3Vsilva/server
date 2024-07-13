const express = require('express');
const cors = require('cors');
const routes = require('./Routes/routes');
const app = express( );


app.use(cors({
    origin: "https://diasemterapia.com.br",
    methods: ["GET", "POST"]
}));


app.use(express.json( ));
app.use(routes);

app.listen(3000, ( )=>{
    console.log('localhost connected in 8080 port');
});