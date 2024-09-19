import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.get('/aur', (req, res) => {
    const url = 'https://aur.archlinux.org/rpc/v5/search/';
    //new change
    const value = req.query.value;

    if (!value) {
        return res.status(400).json({ error: 'Value parameter is required' });
    }

    axios.get(`${url}${value}`)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.get('/alr', (req, res) => {
    const url = 'https://archlinux.org/packages/search/json/?q=';
    //new change
    const value = req.query.value;

    if (!value) {
        return res.status(400).json({ error: 'Value parameter is required' });
    }

    axios.get(`${url}${value}`)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
