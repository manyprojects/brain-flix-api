const express = require('express');
require('dotenv').config();
const app = express();
const PORT =  process.env.PORT ?? 8080;
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const apiUrl = 'https://project-2-api.herokuapp.com';
const key = "966263aa-7639-4571-a879-005ec98839e3";
const dataFilePath = './assets/data/video.json';
const detailedDataPath = './assets/data/detailedVideo.json';


app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use('/assets/images', express.static(__dirname + '/assets/images'));


app.use(express.json());

const readVideo = () => {
    return JSON.parse(fs.readFileSync(dataFilePath));
}

const fetchvideos = async () => {
    const videDetailArr = [];
    try {
        const response = await axios.get(`${apiUrl}/videos?api_key=${key}`);

        // for (let i = 0; i < response.data.length; i++) {
        //     response.data[i].image = `/assets/images/image${i}.jpeg`;
        // }
        fs.writeFileSync(dataFilePath, JSON.stringify(response.data, null, 2));

        const fetchDetailedVideos = async () => {
            try {
                for (let i = 0; i < response.data.length; i++) {
                    const detailedResponse = await axios
                    .get(`${apiUrl}/videos/${response.data[i].id}?api_key=${key}`);
                    videDetailArr.push(detailedResponse.data);
                }
                // console.log(videDetailArr);
                // for (let i = 0; i < videDetailArr.length; i++) {
                //     videDetailArr[i].image = `/assets/images/image${i}.jpeg`;
                // }
                fs.writeFileSync(detailedDataPath, JSON.stringify(videDetailArr, null, 2));

                // app.use(express.json());
                app.get('/', (_req, res) => {
                    const videoData = readVideo();
                    res.status(200).json(videoData);
                });
                
            } catch (err) {
                console.log('data fetching failed from heroku:', err);
            }
        }
        fetchDetailedVideos();

    } catch (err) {
        console.log('data fetching failed from heroku:', err);
    }
}
fetchvideos();


// start Express on port 8080
app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
    console.log('Press CTRL + C to stop server');
});