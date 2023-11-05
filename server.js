// initialize Express in project
const express = require('express');
const app = express();
const  PORT =  process.env.PORT ?? 8080;
const cors = require('cors');

app.use(cors({
    origin: process.env.CLIENT_URL
}));


app.use(express.json());

app.get('/', (_req, res) => {
    res.send('API is running');
});


// start Express on port 8080
app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
    console.log('Press CTRL + C to stop server');
});