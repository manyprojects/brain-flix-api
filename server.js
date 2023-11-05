// initialize Express in project
const express = require('express');
const app = express();
const PORT =  process.env.PORT ?? 8080;
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const apiUrl = 'https://project-2-api.herokuapp.com';
const key = "966263aa-7639-4571-a879-005ec98839e3";
const dataFilePath = './data/video.json';

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.get('/fetch', async (req, res) => {
    try {
        const response = await axios.get(`${apiUrl}/videos?api_key=${key}`);
        console.log(response.data);
        fs.writeFileSync(dataFilePath, JSON.stringify(response.data, null, 2));
        res.status(200).json({ message: 'Data fetched from heroku...' });
    } catch (err) {
        console.log('data fetching failed from heroku:', err);
        res.status(500).json({ message: 'Data fetching unsuccessful from heroku...' });
    }
});




app.use(express.json());

app.get('/', (_req, res) => {
    res.send('API is running');
});


// start Express on port 8080
app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
    console.log('Press CTRL + C to stop server');
});