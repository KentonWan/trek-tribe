import axios from 'axios';
//const axios = require('axios');
const zipcodes = require("./US-zipcode.json");

class TrailAPI {

    async getByZip(zip) {

        function binarySearch(zipcodes,zip){
            let low = 0;
            let high = zipcodes.length -1;

            while(low <= high) {
                const mid = (low+high) >> 1;
                const midV = zipcodes[mid].ZIP;

                if (midV > zip){
                    high = mid - 1;
                } else if (midV < zip) {
                    low = mid + 1;
                } else {
                    return mid
                }
            }
        };

        let value = binarySearch(zipcodes,zip);
        console.log(value);
        console.log(zipcodes[value].LAT);
        console.log(zipcodes[value].LNG);
       
        return await this.getByCoords(zipcodes[value].LAT, zipcodes[value].LNG);
    }

    async getByCoords(lat, lon) {
        try {
            const results = await axios.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=200363022-a84f298e835cedf6d94ba2ebc0626691`);

            return results;
        } catch(err){
            console.log(err);
        }
    }
}

// (async () => {
//     let trailAPI = new TrailAPI();
//     let result = await trailAPI.getByZip(90024);
//     console.log(result.data);
// })();

export default TrailAPI;