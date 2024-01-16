
import cheerio from 'cheerio';
import axios from 'axios';
import _ from 'lodash';

let countFound = 0;
let countTotal = 0;

async function parse(url,outlets) {
    let name, address;
    try {
        const body = await axios.get(url);
        let $ = await cheerio.load(body.data);
        //console.log(body.data);

        //await(
        let nodes = await((await $('div.ecs-posts'))
        .find('.elementor-widget-container'))

        for(let i=0; i<nodes.length; i++){
            let e = nodes[i];
            let text = $(e).contents().text().trim();
            switch (i % 4) {
                case 0:
                    name = text;
                    break;
                case 1:
                    break;
                case 2:
                    address = text.substring(0, text.indexOf("\n"));;
                    break;
                case 3:
                    if (text === 'Direction') {
                        console.log(`${(i-3)/4}:${address}`);                        
                        //let search = address;
                        let geoLocation = await fetchGeoLocation(address);
                            // search = search.substring(search.indexOf(',')+1,search.length).trim()
                            // console.log(`${(i-3)/4}:${search}`);                        
                            // search = search.substring(search.indexOf(',')+1,search.length).trim()
                            // console.log(`${(i-3)/4}:${search}`);                        
                            // geoLocation = await addOsmLocation(search);
                        //}
                        let outlet = { name, address, geoLocation };
                        console.log({outlet})
                        outlets.push(outlet);
                        ++countTotal; console.log({countTotal});
                    }
                    break;
                }        
        }

        // .each(async function (i) {
        //     //.first(async function (i) {
        //         let text = $(e).contents().text().trim();
        //         switch (i % 4) {
        //             case 0:
        //                 name = text;
        //                 break;
        //             case 1:
        //                 break;
        //             case 2:
        //                 address = text.substring(0, text.indexOf("\n"));;
        //                 break;
        //             case 3:
        //                 if (text === 'Direction') {
        //                     console.log(`${(i-3)/4}:${address}`);                        
        //                     //let search = address;
        //                     let geoLocation = await fetchGeoLocation(address);
        //                         // search = search.substring(search.indexOf(',')+1,search.length).trim()
        //                         // console.log(`${(i-3)/4}:${search}`);                        
        //                         // search = search.substring(search.indexOf(',')+1,search.length).trim()
        //                         // console.log(`${(i-3)/4}:${search}`);                        
        //                         // geoLocation = await addOsmLocation(search);
        //                     //}
        //                     let outlet = { name, address, geoLocation };
        //                     console.log({outlet})
        //                     outlets.push(outlet);
        //                     ++countTotal; console.log({countTotal});
        //                 }
        //                 break;
        //         }
        //     })
        // ) 
        console.log({outlets})
        return true;

    } catch (err) {
        console.log(err);
        return false;
    }
}


const zusBaseUrl = 'https://zuscoffee.com/category/store/melaka'
const openStreetMapBaseUrl = 'https://nominatim.openstreetmap.org/search'
const osmCfg = {format: 'json',osmtype: 'N'}
'q=2, Jalan Lagenda 2, Taman 1 Lagenda, 75400 Melaka'

async function fetchGeoLocation(address){
    console.log('fetchGeoLocation...', address);_
    let geoLocation = await addOsmLocation(address);
    if (! _.isEmpty(geoLocation)) return geoLocation; 
    let search = address.substring(address.indexOf(',')+1,address.length).trim()
    if(search === address) return geoLocation;
    return await fetchGeoLocation(search)
}

async function populate() {
    let outlets = [];
    let rz = true;
    let page = 1;
    do {
        rz = await parse(`${zusBaseUrl}/page/${page}`,outlets);
        page++;
    }
    while (rz)
    console.log({ outlets })
    return outlets;
}

async function addOsmLocation(q){
    console.log('addOsmLocation...',q)
    let avgGeoLocation = {};
    try{
        let params = new URLSearchParams({...osmCfg, q})
        let url = `${openStreetMapBaseUrl}?${params}`
        console.log(url);
        let rz = await axios.get(url)
        console.log({rz})
        let data = rz.data;
        if (data.length > 0)
        {
            console.log("Location found");
            ++countFound; console.log({countFound});
            let geoLocation = data;
            avgGeoLocation = avg(data);
            console.log({avgGeoLocation})  
            console.log({geoLocation})
        }
        else
            console.log("No location found");
    }
    catch(error){
        console.log(error.message)
    }
    return avgGeoLocation;
}

const avg = data => {
    const sum = data
    .map(el => { return {lon: parseFloat(el.lon),lat: parseFloat(el.lat)}})
    .reduce((acc, cur) => {
        return { 
            lon: acc.lon + cur.lon,
            lat: acc.lat + cur.lat
        }
    });
    const average = { lon: sum.lon/data.length, lat: sum.lat/data.length }
    return average;
  }


export {populate as default}