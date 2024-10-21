const {FingerprintSolution} = require('fingerprint-solution');
const {
    findUserByPin,
    executionCodeMasuk,
    executionCodePulang,
    executionCodeShiftMasuk,
    executionCodeShiftPulang
} = require('./inout_attribute.controller');
const date = require('date-and-time');

const getDataFinger = async(ip, day) => {

    try {
        const datas = await FingerprintSolution.download(ip, []);

        const date_now = new Date();
        date_now.setDate(date_now.getDate() - day);
        const min = date.format(date_now, 'YYYY-MM-DD HH:mm:ss');

        const absen_masuk = datas.filter(
            data=>
            data.status == 0 &&
            data.time > min
        );

        const absen_pulang = datas.filter(
            data=>
            data.status == 1 &&
            data.time > min
        );
        
        const absen_shift_masuk = datas.filter(
            data=>
            data.status == 4 &&
            data.time > min
        );
        
        const absen_shift_pulang = datas.filter(
            data=>
            data.status == 5 &&
            data.time > min
        );

        //absen masuk
        const code_masuk = [0, 8];

        //submit absen masuk
        await Promise.all(absen_masuk.map(async (data)=>{
            const get_date = new Date(data.time);
            const time_format = date.format(get_date, 'HH:mm:ss');
            const date_format = date.format(get_date, 'YYYY-MM-DD');
            const date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

            //cari data user
            const user = await findUserByPin({absen_id:data.pin});

            const result = await executionCodeMasuk({
                user:user,
                code_tipe_absen:data.status,
                date_format:date_format,
                code_masuk:code_masuk,
                time_format:time_format,
                date_time_format:date_time_format
            })
        }))

        //absen pulang
        const code_pulang = [1, 9];

        await Promise.all(absen_pulang.map(async (data)=>{
            const get_date = new Date(data.time);
            const time_format = date.format(get_date, 'HH:mm:ss');
            const date_format = date.format(get_date, 'YYYY-MM-DD');
            const date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

            //cari data user
            const user = await findUserByPin({absen_id:data.pin});

            const result = await executionCodePulang({
                user:user,
                code_tipe_absen:data.status,
                date_format:date_format,
                code_masuk:code_masuk,
                code_pulang:code_pulang,
                time_format:time_format,
                date_time_format:date_time_format
            })

        }))

        //absen masuk shift
        const code_masuk_shift = [4];

        await Promise.all(absen_shift_masuk.map(async (data)=>{
            const get_date = new Date(data.time);
            const time_format = date.format(get_date, 'HH:mm:ss');
            const date_format = date.format(get_date, 'YYYY-MM-DD');
            const date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

            //cari data user
            const user = await findUserByPin({absen_id:data.pin});
            
            const result = await executionCodeShiftMasuk({
                user:user,
                code_tipe_absen:data.status,
                date_format:date_format,
                code_masuk_shift:code_masuk_shift,
                time_format:time_format,
                date_time_format:date_time_format
            })
        }))

        //absen masuk shift by web
        const code_pulang_shift = [5];

        await Promise.all(absen_shift_pulang.map(async (data)=>{
            const get_date = new Date(data.time);
            const time_format = date.format(get_date, 'HH:mm:ss');
            const date_format = date.format(get_date, 'YYYY-MM-DD');
            const date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

            //cari data user
            const user = await findUserByPin({absen_id:data.pin});

            const result = await executionCodeShiftPulang({
                user:user,
                code_tipe_absen:code_tipe_absen,
                date_format:date_format,
                code_masuk_shift:code_masuk_shift,
                code_pulang_shift:code_pulang_shift,
                time_format:time_format,
                date_time_format:date_time_format
            })

        }))
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    getDataFinger
}