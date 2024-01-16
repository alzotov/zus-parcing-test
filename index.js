
import Redis from 'ioredis'
import express from 'express';
import cors from 'cors';

import populate from './populate.js';

const redis = new Redis();

const redisSet = "zusm"

// let outlets = await populate();
// console.log({outlets});
// await redis.del(redisSet)
// for(let outlet of outlets) {
//     console.log({outlet});
//     let rz = await redis.geoadd(redisSet, outlet.geoLocation.lon, outlet.geoLocation.lat, outlet.address)
//     console.log({rz});
// }

var app = express();
app.use(cors);

const PORT = 3000;

app.get("/outlets/list", async(req, res, next) => {
    //let rz = await redis.zrange(redisSet,0,-1)
    let rz = await redis.georadius(redisSet,0,0,22000,'km','WITHCOORD')
    console.log({rz});
    res.json(rz);
});

app.get('/', (req, res) => {
    res.send('Assignement Zus Parsing')
  })

app.get("/outles/radius/:km", async(req, res, next) => {
    let location = req.query;
    let radius = req.params.km;
    const result = await redis.georadius(redisSet, location.lon, location.lat, radius, "km")
    console.log(result) // 2
    res.json(result);
});   

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

