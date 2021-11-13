const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/campersLife')
.then(()=>{
    console.log("did it")
})
.catch(e=>{
    console.log("connection failed")
})

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: "61852fe79f96a847b9fd1e29",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatum, earum nostrum? Cumque quia reprehenderit aperiam et, exercitationem sit, laudantium quod at suscipit officiis iste laborum temporibus voluptatem possimus ipsum ducimus.Distinctio voluptas adipisci labore cumque harum exercitationem, architecto atque voluptates rem voluptatem provident, animi voluptatum officiis, asperiores ipsum eius. Cupiditate facilis doloremque nobis placeat beatae adipisci molestiae, tempore magnam molestias!",
            price: random1000,
            images: [
                {
                  url: 'https://res.cloudinary.com/dtbzkm9ef/image/upload/v1636286941/campingLife/jgccig0nssdkcp9e6wuf.jpg',
                  filename: 'campingLife/jgccig0nssdkcp9e6wuf'
                },
                {
                  url: 'https://res.cloudinary.com/dtbzkm9ef/image/upload/v1636286941/campingLife/akcxlj5w6brmb9mo92uc.jpg',
                  filename: 'campingLife/akcxlj5w6brmb9mo92uc'
                }
              ],   
              geometry: {
                    "type":"Point",
                    "coordinates":[cities[random1000].longitude,cities[random1000].latitude]}         
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})