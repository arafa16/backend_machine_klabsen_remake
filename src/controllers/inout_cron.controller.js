const {
    mesin_absen:mesinAbsenModel
} = require('../models/index.js');
const {
    getDataFinger
} = require('./inout_data.controller.js')

const getMesinAbsen = async() => {

    const mesin = await mesinAbsenModel.findAll();

    try {
        for(let i = 0; i < mesin.length; i++){
            const ip = mesin[i].ip_mesin;
            const day = mesin[i].day;

            console.log('mesin', ip, day)

            const result = await getDataFinger(ip, day)

            console.log('selesai', ip, day)
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getMesinAbsen
}