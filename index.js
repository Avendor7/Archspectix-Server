import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.get('/aur', async (req, res) => {
    const url = 'https://aur.archlinux.org/rpc/v5/search/';
    //new change
    const value = req.query.value;

    if (!value) {
        return res.status(400).json({ error: 'Value parameter is required' });
    }

    try {
        const aurData = await searchAUR(value);
        return res.json(aurData);
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ error });
    }
});

app.get('/alr', async (req, res) => {
    const url = 'https://archlinux.org/packages/search/json/?q=';
    //new change
    const value = req.query.value;

    if (!value) {
        return res.status(400).json({ error: 'Value parameter is required' });
    }

    try {
        const alrData = await searchALR(value);
        return res.json(alrData);
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ error });
    }
});

app.get('/search', (req, res) => {

    const value = req.query.value;

    if (!value) {
        return res.status(400).json({ error: 'Value parameter is required' });
    }
    const ALRResult = searchALR(value);
    const AURResult = searchAUR(value);

    if (ALRResult || AURResult == "error") {
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        res.status(200).json({
            ALRResult,
            AURResult
        });
    }

});

function searchALR(value) {
    const url = 'https://archlinux.org/packages/search/json/?q=';

    return axios.get(`${url}${value}`)
        .then((response) => response.data) // Return the data directly from .then()
        .catch((error) => {
            console.error(error);
            throw error; // Re-throw the error to propagate it up the call stack
        });
}

function searchAUR(value) {
    const url = 'https://archlinux.org/packages/search/json/?q=';

    return axios.get(`${url}${value}`)
        .then((response) => response.data) // Return the data directly from .then()
        .catch((error) => {
            console.error(error);
            throw error; // Re-throw the error to propagate it up the call stack
        });
}

app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
