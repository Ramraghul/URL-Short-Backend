//Required;
const express = require('express');
const App = express();
require('./Src/Connection/Connection')
const User = require('./Src/Routes/UserRoute');
const URL = require('./Src/Routes/URLRoute');
const cors = require('cors');

//Middleware;
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(cors({ origin: "*"}))


//User Routes;
App.use('/',User);
App.use('/User',User);
App.use('/Url',URL);


//Port Listing;
const PORT = process.env.PORT || 7777;
App.listen(PORT, () => {
    console.log('Port is Running on ' + PORT);
});
