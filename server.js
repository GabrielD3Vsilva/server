const express = require('express');
const cors = require('cors');
const routes = require('./Routes/routes');
const app = express( );

app.use(cors( ));
app.use(express.json( ));
app.use(routes);

app.listen(8080, ( )=>{
    console.log('localhost connected in 8080 port');
})