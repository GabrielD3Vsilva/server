const express = require('express');
const cors = require('cors');
const routes = require('./Routes/routes');
const app = express( );
const bodyParser = require('body-parser');

app.use(cors( ));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
  
  
app.use(express.json( ));
app.use(routes);

app.listen(3000, ( )=>{
    console.log('localhost connected in 8080 port');
});