// initialize Express in project
const express = require('express');
const app = express();
const  PORT =  process.env.PORT ?? 8080;

// start Express on port 8080
app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
    console.log('Press CTRL + C to stop server');
});