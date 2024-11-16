import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.get('/api/aur/search', async (req, res) => {
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

app.get('/api/alr/search', async (req, res) => {
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

app.get('/api/search', async (req, res) => {

    const value = req.query.value;

    if (!value) {
        return res.status(400).json({ error: 'Value parameter is required' });
    }
    let alrData = {};
    let aurData = {};

    try {
        alrData = await searchALR(value);
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ error });
    }
    try {
        aurData = await searchAUR(value);
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ error });
    }
    console.log("search complete for: " + value);
    res.status(200).json(normalizeResults(alrData, aurData));

});

app.get('/api/alr/info', async (req, res) => {
    const value = req.query.value;

    if (!value) {
        return res.status(400).json({ error: 'Value parameter is required' });
    }

    try {
        const alrData = await getPackageInfoALR(value);
        return res.json(alrData);
    } catch (error) {
        //console.log('Error', error);
        return res.status(500).json({ error });
    }
});


app.get('/api/aur/info', async (req, res) => {
    const value = req.query.value;

    if (!value) {
        return res.status(400).json({ error: 'Value parameter is required' });
    }

    try {
        let aurData = await getPackageInfoAUR(value);
        aurData.results[0].LastModified = convertEpochToISO8601(aurData.results[0].LastModified);
        aurData.results[0].OutOfDate = convertEpochToISO8601(aurData.results[0].OutOfDate);
        return res.json(aurData);
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ error });
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
    const url = 'https://aur.archlinux.org/rpc/v5/search/';
    
    return axios.get(`${url}${value}`)
        .then((response) => response.data) // Return the data directly from .then()
        .catch((error) => {
            console.error(error);
            throw error; // Re-throw the error to propagate it up the call stack
        });
}

function getPackageInfoAUR(value) {
    const url = 'https://aur.archlinux.org/rpc/v5/info?arg=';

    return axios.get(`${url}${value}`)
        .then((response) => response.data) // Return the data directly from .then()
        .catch((error) => {
            console.error(error);
            throw error; // Re-throw the error to propagate it up the call stack
        });

}

function getPackageInfoALR(value) {
    const url = 'https://archlinux.org/packages/search/json/?name=';

    return axios.get(`${url}${value}`)
        .then((response) => response.data) // Return the data directly from .then()
        .catch((error) => {
            console.error(error);
            throw error; // Re-throw the error to propagate it up the call stack
        });
}

function normalizeResults(alrData, aurData) {
    //TODO: this should use an interface when converted to typescript
    let allResults = [];
    for (const result of alrData.results) {
        allResults.push({
            name: result.pkgname,
            version: result.pkgver,
            source: "ALR",
            description: result.description,
            last_updated_date: result.last_update,
            flagged_date: result.flag_date
        });
    }
    for (const result of aurData.results) {
        allResults.push({
            name: result.Name,
            version: result.Version,
            source: "AUR",
            description: result.Description,
            last_updated_date: convertEpochToISO8601(result.LastModified),
            flagged_date: convertEpochToISO8601(result.OutOfDate)
        });
    }

    return allResults;
}

function convertEpochToISO8601(epoch) {
    if (epoch) {
        return new Date(epoch * 1000);
    } else {
        return null;
    }

}

app.listen(3031, () => {
    console.log('Server listening on port 3031');
});
