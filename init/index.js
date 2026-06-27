const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const maptilerClient = require("@maptiler/client");
const Listing = require("../models/listing");
const initData = require("./data");

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Saray');
}
main()
.then(()=>{
    console.log('Connect to DB');
})
.catch((err)=>{
    console.log('Some error: '+ err);
});

const initDB = async () => {
    await Listing.deleteMany({});

    const listings = await Promise.all(
        initData.data.map(async (obj) => {

           const response = await maptilerClient.geocoding.forward(
    `${obj.location}, ${obj.country}`
);

            return {
                ...obj,
                owner: "6a36e050e641d76b82f292bc",
                geometry: response.features[0].geometry,
            };
        })
    );

    await Listing.insertMany(listings);

    console.log("Data was initialized");
};
initDB();
