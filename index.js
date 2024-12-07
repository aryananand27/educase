const db=require('./Db/mysql');
const createtable=require('./models/table');
const express = require('express');
const cors=require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
app.get('/',(req,resp)=>{
    resp.status(200).send({message:"Hello From home page!!"})
})

app.post('/addSchool', (req, resp) => {
    const { name, address, latitude, longitude } = req.body;

  
    if (!name || !address || !latitude || !longitude) {
        return resp.status(400).send({clienterror:'All fields are required' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error(err);
            return resp.status(500).send({message:'Database error' });
        }
        resp.status(201).send({ message: 'School added successfully', schoolId: result.insertId });
    });
});

app.get('/listSchools', (req, resp) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return resp.status(400).json({clienterror:'User latitude and longitude are required for sorting functionalities.' });
    }

    const userlatitude = parseFloat(latitude);
    const userlongitude = parseFloat(longitude);

    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return resp.status(500).json({error:'Database error'} );
        }

        const schoolsWithDistance = results.map(school => ({
            ...school,
            distance: calculateDistance(userlatitude, userlongitude, school.latitude, school.longitude),
        }));

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        resp.status(201).json({result:schoolsWithDistance});
    });
});

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server Listening on port 3000');
});

