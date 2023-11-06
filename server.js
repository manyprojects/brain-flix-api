const express = require('express');
require('dotenv').config();
const app = express();
const PORT =  process.env.PORT ?? 8080;
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const apiUrl = 'https://project-2-api.herokuapp.com';
const key = "966263aa-7639-4571-a879-005ec98839e3";
const dataFilePath = './public/data/video.json';
const detailedDataPath = './public/data/detailedVideo.json';
const { v4: uuid } = require('uuid');


app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use('/public/images', express.static(__dirname + '/public/images'));

app.use(express.json());

const readVideoDetails = () => {
    return JSON.parse(fs.readFileSync(detailedDataPath));
}

const readHeroVideo = (videoId) => {
    const videoDetailsArr = JSON.parse(fs.readFileSync(detailedDataPath));
    return videoDetailsArr.find(e => e.id === videoId);
}

const fetchvideos = async () => {
    const videDetailArr = [];
    try {
        const response = await axios.get(`${apiUrl}/videos?api_key=${key}`);

        for (let i = 0; i < response.data.length; i++) {
            response.data[i].image = `http://localhost:8080/public/images/image${i}.jpeg`;
        }
        const fetchDetailedVideos = async () => {
            try {
                for (let i = 0; i < response.data.length; i++) {
                    const detailedResponse = await axios
                    .get(`${apiUrl}/videos/${response.data[i].id}?api_key=${key}`);
                    videDetailArr.push(detailedResponse.data);
                }
                for (let i = 0; i < videDetailArr.length; i++) {
                    videDetailArr[i].image = `http://localhost:8080/public/images/image${i}.jpeg`;
                }
                // only weites data to local json if it's empty
                if(fs.statSync(detailedDataPath).size === 0){
                    fs.writeFileSync(detailedDataPath, JSON.stringify(videDetailArr, null, 2));
                }

                app.get('/videos', (_req, res) => {
                    const videoDetails = readVideoDetails();
                    if (videoDetails) {
                        res.status(200).json(videoDetails);
                    } else {
                        res.status(404).json({ message: 'page not found' });
                    } 
                });

                app.get('/videos/:id', (req, res) => {
                    const videoId = req.params.id;
                    const heroVideo = readHeroVideo(videoId);
                    if (heroVideo) {
                        res.status(200).json(heroVideo);
                    } else {
                        res.status(404).json({ message: 'page not found' });
                    } 
                });

                app.post('/videos', (req, res) => {
                    const {title, description} = req.body;
                    const newDetailedVideo = {
                        id: uuid(),
                        title: title,
                        channel: "channel",
                        image: "http://localhost:8080/public/images/Upload-video-preview.jpg",
                        description: description,
                        views: 0,
                        likes: 0,
                        duration: "1:00",
                        video: "https://project-2-api.herokuapp.com/stream",
                        timestamp: Date.now(),
                        comments: [
                            {
                              id: "ade82e25-6c87-4403-ba35-47bdff93a51c",
                              name: "anonymous",
                              comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint eos amet ipsam, delectus impedit cum repudiandae deserunt corporis, perferendis tenetur error reiciendis temporibus! Natus officia dolorum, ratione inventore consequatur magni!",
                              likes: 0,
                              timestamp: Date.now()
                            }
                        ]
                    }
                    const newVideo = {
                        id: newDetailedVideo.id,
                        title: newDetailedVideo.title,
                        channel: newDetailedVideo.channel,
                        image: "http://localhost:8080/public/images/Upload-video-preview.jpg"
                    }
                    videDetailArr.push(newDetailedVideo);
                    response.data.push(newVideo);
                    fs.writeFileSync(detailedDataPath, JSON.stringify(videDetailArr, null, 2));
                });

                
            } catch (err) {
                throw new Error("Can't fetch data");
            }
        }
        fetchDetailedVideos();

    } catch (err) {
        throw new Error("Can't fetch data");
    }
}
fetchvideos();

// start Express on port 8080
app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
    console.log('Press CTRL + C to stop server');
});