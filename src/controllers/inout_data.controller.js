const {FingerprintSolution} = require('fingerprint-solution');
const {
    findUserByPin,
    findTipeAbsen,
    findIn,
    findInOut,
    findJamOperasionals,
    findJamOperasionalGroup,
    findJamOperasionalsTerakhir,
    findDataTidakAbsenDouble,
    findDataInDouble,
    findDataOutDouble,
    uploadAbsen
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
            let get_date = new Date(data.time);
            let time_format = date.format(get_date, 'HH:mm:ss');
            let date_format = date.format(get_date, 'YYYY-MM-DD');
            let date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

            console.log(data.pin);
            //cari data user
            let user = await findUserByPin({absen_id:data.pin});
            let tipeAbsen = await findTipeAbsen({code:data.status});

            console.log(user.name, tipeAbsen.name, date_time_format);

            if(user !== null && tipeAbsen !== null){
                
                let inOut = await findInOut({ 
                    user_id:user.id,
                    date_format:date_format,
                    code:code_masuk
                });

                if(inOut !== null){
                    await findDataInDouble({
                        user_id:user.id,
                        date_format:date_format,
                        code_masuk:code_masuk
                    })
                }
                else{
                    //delete data tidak absen jika ada
                    await findDataTidakAbsenDouble({
                        user_id:user.id,
                        date_format:date_format
                    })

                    const jamOperasional = await findJamOperasionals({
                        time_format:time_format, 
                        jam_operasional_group_id:user.jam_operasional_group_id
                    });

                    //jika telat
                    if(!jamOperasional){
                        const jamOperasionalTerakhir = await findJamOperasionalsTerakhir({
                            jam_operasional_group_id:user.jam_operasional_group_id
                        });

                        const result = await uploadAbsen({
                            user_id:user.id,
                            tipe_absen_id:tipeAbsen.id,
                            tanggal_mulai:date_time_format,
                            tanggal_selesai:date_time_format,
                            pelanggaran_id:2,
                            status_inout_id:1,
                            jam_operasional_id:jamOperasionalTerakhir[0].id,
                            is_active:true
                        })
                    }
                    else{
                        const result = await uploadAbsen({
                            user_id:user.id,
                            tipe_absen_id:tipeAbsen.id,
                            tanggal_mulai:date_time_format,
                            tanggal_selesai:date_time_format,
                            pelanggaran_id:1,
                            status_inout_id:1,
                            jam_operasional_id:jamOperasional.id,
                            is_active:true
                        })
                    }
                }
            }

        }))

        //absen pulang
        const code_pulang = [1, 9];

        await Promise.all(absen_pulang.map(async (data)=>{
            const get_date = new Date(data.time);
            const time_format = date.format(get_date, 'HH:mm:ss');
            const date_format = date.format(get_date, 'YYYY-MM-DD');
            const date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

            console.log(data.pin);

            //cari data user
            let user = await findUserByPin({absen_id:data.pin});
            let tipeAbsen = await findTipeAbsen({code:data.status});

            const tidakAbsen = await findTipeAbsen({code:11})

            console.log(user.name, tipeAbsen.name, date_time_format);


            if(user !== null && tipeAbsen !== null && tidakAbsen !== null){
                let inOut = await findInOut({ 
                    user_id:user.id,
                    date_format:date_format,
                    code:code_pulang
                });

                if(inOut !== null){
                    await findDataOutDouble({
                        user_id:user.id,
                        date_format:date_format,
                        code_pulang:code_pulang
                    })
                }
                else{
                    let inCheck = await findInOut({
                        user_id:user.id,
                        date_format:date_format,
                        code:code_masuk
                    });

                    if(inCheck !== null){
                        if(inCheck.jam_operasional.jam_pulang < time_format){
                            const uploadAbsenNormal = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tipeAbsen.id,
                                tanggal_mulai:date_time_format,
                                tanggal_selesai:date_time_format,
                                pelanggaran_id:1,
                                status_inout_id:1,
                                jam_operasional_id:inCheck.jam_operasional_id,
                                is_active:true
                            });
                        }
                        else{
                            const uploadAbsenNormal = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tipeAbsen.id,
                                tanggal_mulai:date_time_format,
                                tanggal_selesai:date_time_format,
                                pelanggaran_id:2,
                                status_inout_id:1,
                                jam_operasional_id:inCheck.jam_operasional_id,
                                is_active:true
                            });
                        }
                    }
                    else{
                        let jamOperasionalTerakhir = await findJamOperasionalsTerakhir({
                            jam_operasional_group_id:user.jam_operasional_group_id
                        });

                        if(jamOperasionalTerakhir[0].jam_pulang < time_format){
                            let uploadAbsenTidakMasuk = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tidakAbsen.id,
                                tanggal_mulai:date_format+ ' 00:00:00',
                                tanggal_selesai:date_format+ ' 00:00:00',
                                pelanggaran_id:2,
                                status_inout_id:1,
                                jam_operasional_id:jamOperasionalTerakhir[0].id,
                                is_active:true
                            });

                            let uploadAbsenPulangNormal = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tipeAbsen.id,
                                tanggal_mulai:date_time_format,
                                tanggal_selesai:date_time_format,
                                pelanggaran_id:1,
                                status_inout_id:1,
                                jam_operasional_id:jamOperasionalTerakhir[0].id,
                                is_active:true
                            });
                        }
                        else{
                            let uploadAbsenTidakMasuk = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tidakAbsen.id,
                                tanggal_mulai:date_format+ ' 00:00:00',
                                tanggal_selesai:date_format+ ' 00:00:00',
                                pelanggaran_id:2,
                                status_inout_id:1,
                                jam_operasional_id:jamOperasionalTerakhir[0].id,
                                is_active:true
                            });

                            let uploadAbsenPulangNormal = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tipeAbsen.id,
                                tanggal_mulai:date_time_format,
                                tanggal_selesai:date_time_format,
                                pelanggaran_id:2,
                                status_inout_id:1,
                                jam_operasional_id:jamOperasionalTerakhir[0].id,
                                is_active:true
                            });
                        }
                    }
                }
            }
        }))

        //absen masuk shift
        const code_masuk_shift = [4];

        await Promise.all(absen_shift_masuk.map(async (data)=>{
            const get_date = new Date(data.time);
            const time_format = date.format(get_date, 'HH:mm:ss');
            const date_format = date.format(get_date, 'YYYY-MM-DD');
            const date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

            console.log(data.pin);

            //cari data user
            let user = await findUserByPin({absen_id:data.pin});
            let tipeAbsen = await findTipeAbsen({code:data.status});

            console.log(user.name, tipeAbsen.name, date_time_format);


            if(user !== null && tipeAbsen !== null){
                let inOut = await findInOut({ 
                    user_id:user.id,
                    date_format:date_format,
                    code:code_masuk_shift
                });

                if(inOut !== null){
                    console.log('user', user.id, tipeAbsen.id, inOut.id);
                }
                else{
                    const jamOperasionalGroup = await findJamOperasionalGroup({code:3});

                    if(jamOperasionalGroup !== null){
                        const jamOperasional = await findJamOperasionals({
                            time_format:time_format, 
                            jam_operasional_group_id:jamOperasionalGroup.id
                        });
    
                        if(jamOperasional !== null){
                            const result = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tipeAbsen.id,
                                tanggal_mulai:date_time_format,
                                tanggal_selesai:date_time_format,
                                pelanggaran_id:1,
                                status_inout_id:1,
                                jam_operasional_id:jamOperasional.id,
                                is_active:true
                            })
                        }
                        else{
                            const jamOperasionalTerakhir = await findJamOperasionalsTerakhir({
                                jam_operasional_group_id:jamOperasionalGroup.id
                            });

                            const result_telat = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tipeAbsen.id,
                                tanggal_mulai:date_time_format,
                                tanggal_selesai:date_time_format,
                                pelanggaran_id:1,
                                status_inout_id:1,
                                jam_operasional_id:jamOperasionalTerakhir[0].id,
                                is_active:true
                            })
                        }
                    }
                }
            }

            // //cari data user
            // const user = await findUserByPin({absen_id:data.pin});
            
            // const result = await executionCodeShiftMasuk({
            //     user:user,
            //     code_tipe_absen:data.status,
            //     date_format:date_format,
            //     code_masuk_shift:code_masuk_shift,
            //     time_format:time_format,
            //     date_time_format:date_time_format
            // })
            console.log('in shift', data)
        }))

        //absen masuk shift by web
        const code_pulang_shift = [5];

        await Promise.all(absen_shift_pulang.map(async (data)=>{
            const get_date = new Date(data.time);
            const time_format = date.format(get_date, 'HH:mm:ss');
            const date_format = date.format(get_date, 'YYYY-MM-DD');
            const date_time_format = date.format(get_date, 'YYYY-MM-DD HH:mm:ss');

            console.log(data.pin);
            
            //cari data user
            let user = await findUserByPin({absen_id:data.pin});
            let tipeAbsen = await findTipeAbsen({code:data.status});

            const tidakAbsen = await findTipeAbsen({code:11})

            console.log(user.name, tipeAbsen.name, date_time_format);

            if(user !== null && tipeAbsen !== null && tidakAbsen !== null){
                let inOut = await findInOut({ 
                    user_id:user.id,
                    date_format:date_format,
                    code:code_pulang_shift
                });

                if(inOut !== null){
                    await findDataOutDouble({
                        user_id:user.id,
                        date_format:date_format,
                        code_pulang:code_pulang_shift
                    })
                }
                else{
                    let inCheck = await findInOut({
                        user_id:user.id,
                        date_format:date_format,
                        code:code_masuk_shift
                    });

                    if(inCheck !== null){
                        if(inCheck.jam_operasional.jam_pulang < time_format){
                            const uploadAbsenNormal = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tipeAbsen.id,
                                tanggal_mulai:date_time_format,
                                tanggal_selesai:date_time_format,
                                pelanggaran_id:1,
                                status_inout_id:1,
                                jam_operasional_id:inCheck.jam_operasional_id,
                                is_active:true
                            });
                        }
                        else{
                            const uploadAbsenNormal = await uploadAbsen({
                                user_id:user.id,
                                tipe_absen_id:tipeAbsen.id,
                                tanggal_mulai:date_time_format,
                                tanggal_selesai:date_time_format,
                                pelanggaran_id:2,
                                status_inout_id:1,
                                jam_operasional_id:inCheck.jam_operasional_id,
                                is_active:true
                            });
                        }
                    }
                    else{
                        const jamOperasionalGroup = await findJamOperasionalGroup({code:3});

                        if(jamOperasionalGroup !== null){
                            let jamOperasionalTerakhir = await findJamOperasionalsTerakhir({
                                jam_operasional_group_id:jamOperasionalGroup.id
                            });

                            if(jamOperasionalTerakhir !== null){
                                if(jamOperasionalTerakhir[0].jam_pulang < datas.time_format){
                                    const uploadAbsenTidakMasuk = await uploadAbsen({
                                        user_id:user.id,
                                        tipe_absen_id:tidakAbsen.id,
                                        tanggal_mulai:date_format+ ' 00:00:00',
                                        tanggal_selesai:date_format+ ' 00:00:00',
                                        pelanggaran_id:2,
                                        status_inout_id:1,
                                        jam_operasional_id:jamOperasionalTerakhir[0].id,
                                        is_active:true
                                    });
    
                                    const uploadAbsenPulangNormal = await uploadAbsen({
                                        user_id:user.id,
                                        tipe_absen_id:tipeAbsen.id,
                                        tanggal_mulai:date_time_format,
                                        tanggal_selesai:date_time_format,
                                        pelanggaran_id:1,
                                        status_inout_id:1,
                                        jam_operasional_id:jamOperasionalTerakhir[0].id,
                                        is_active:true
                                    });
                                }
                                else{
                                    const uploadAbsenTidakMasuk = await uploadAbsen({
                                        user_id:user.id,
                                        tipe_absen_id:tidakAbsen.id,
                                        tanggal_mulai:date_format+ ' 00:00:00',
                                        tanggal_selesai:date_format+ ' 00:00:00',
                                        pelanggaran_id:2,
                                        status_inout_id:1,
                                        jam_operasional_id:jamOperasionalTerakhir[0].id,
                                        is_active:true
                                    });
    
                                    const uploadAbsenPulangNormal = await uploadAbsen({
                                        user_id:user.id,
                                        tipe_absen_id:tipeAbsen.id,
                                        tanggal_mulai:date_time_format,
                                        tanggal_selesai:date_time_format,
                                        pelanggaran_id:2,
                                        status_inout_id:1,
                                        jam_operasional_id:jamOperasionalTerakhir[0].id,
                                        is_active:true
                                    });
                                }
                            }
                        }
                        
                    }
                }
            }
        }))
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    getDataFinger
}