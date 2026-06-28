const { FingerprintSolution } = require("fingerprint-solution");

const {
  in_out: inOutModel,
  user: userModel,
  tipe_absen: tipeAbsenModel,
  pelanggaran: pelanggaranModel,
  status_inout: statusInoutModel,
  jam_operasional: jamOperasionalModel,
  jam_operasional_group: jamOperasionalGroupModel,
  koreksi: koreksiModel,
  mesin_absen: mesinAbsenModel,
} = require("../models/index.js");
const { Op, literal } = require("sequelize");
const date = require("date-and-time");
const moment = require("moment");

// Find user by PIN
async function processFindUserByPin(pin) {
  const findUser = await userModel.findOne({
    where: {
      absen_id: pin,
    },
    attributes: ["id", "name", "absen_id", "jam_operasional_group_id"],
    include: [
      {
        model: jamOperasionalGroupModel,
        attributes: ["id", "name", "code"],
        include: [
          {
            model: jamOperasionalModel,
            as: "jam_operasional",
            where: {
              is_active: true,
            },
            attributes: [
              "id",
              "name",
              "code",
              "jam_masuk",
              "jam_pulang",
              "is_active",
            ],
          },
        ],
      },
    ],
  });

  return findUser;
}

// Find tipe absen by code
async function processFindTipeAbsenByCode(code) {
  const findTypeAbsen = await tipeAbsenModel.findOne({
    where: {
      code: code,
      is_active: true,
    },
    attributes: ["id", "name", "code", "is_active"],
  });

  return findTypeAbsen;
}

async function processFilterDataDouble(datas, code) {
  const { user_id, time } = datas;
  let get_date = new Date(time);
  let date_format = date.format(get_date, "YYYY-MM-DD");

  const result = await inOutModel.findAll({
    where: {
      user_id: user_id,
      tanggal_mulai: {
        [Op.and]: {
          [Op.gte]: date_format + " 00:00:00",
          [Op.lte]: date_format + " 23:59:59",
        },
      },
    },
    include: [
      {
        model: tipeAbsenModel,
        where: {
          code: { [Op.in]: code },
        },
      },
      {
        model: koreksiModel,
      },
    ],
    order: [["tanggal_mulai", "ASC"]],
  });

  if (result.length > 1) {
    const idsToDelete = result.slice(1).map((item) => item.id);

    await koreksiModel.destroy({
      where: {
        in_out_id: {
          [Op.in]: idsToDelete,
        },
      },
    });

    const delete_now = await inOutModel.destroy({
      where: {
        id: {
          [Op.in]: idsToDelete,
        },
      },
      individualHooks: true,
    });
    console.log("deleted", delete_now);
  }
}

// Check absen data is already exist
async function processCheckAbsenIsExist(data, code) {
  const { user_id, time, tipe_absen } = data;

  let is_exist = false;

  let get_date = new Date(time);
  let date_format = date.format(get_date, "YYYY-MM-DD");

  const findData = await inOutModel.findOne({
    where: {
      user_id: user_id,
      tanggal_mulai: {
        [Op.and]: {
          [Op.gte]: date_format + " 00:00:00",
          [Op.lte]: date_format + " 23:59:59",
        },
      },
    },
    include: [
      {
        model: tipeAbsenModel,
        where: {
          code: { [Op.in]: code },
        },
      },
      {
        model: jamOperasionalModel,
      },
    ],
  });

  if (findData) {
    is_exist = true;
  }

  return { is_exist, data: findData };
}

async function processFilterData(datas) {
  const { ip_mesin, start_date, end_date } = datas;

  console.log("get data IP Mesin:", ip_mesin);
  const data = await FingerprintSolution.download(ip_mesin, []);

  console.log("loading filter data by date...", start_date, end_date);

  let filteredData = data;

  if (start_date || end_date) {
    console.log("------------------------------ process data : ", data.length);

    const startDate = start_date ? new Date(`${start_date} 00:00:00`) : null;

    const endDate = end_date ? new Date(`${end_date} 23:59:59`) : null;

    filteredData = data.filter((item) => {
      const logDate = new Date(item.time);

      return (
        (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate)
      );
    });

    console.log("filtered data", filteredData.length);
  }

  console.log("loading filter data by status...");

  let filteredDataIn = [];
  let filteredDataOut = [];
  let filteredDataInShift = [];
  let filteredDataOutShift = [];

  for (const item of filteredData) {
    if (item.status === "0") {
      filteredDataIn.push(item);
    } else if (item.status === "1") {
      filteredDataOut.push(item);
    } else if (item.status === "4") {
      filteredDataInShift.push(item);
    } else if (item.status === "5") {
      filteredDataOutShift.push(item);
    }
  }

  console.log("loading user data by pin...");

  let dataIn = [];
  let dataOut = [];
  let dataInShift = [];
  let dataOutShift = [];

  // data in
  await Promise.all(
    filteredDataIn.map(async (item) => {
      const findUser = await processFindUserByPin(item.pin);

      const findTypeAbsen = await processFindTipeAbsenByCode(item.status);

      if (findUser === null) {
        console.log("find user tidak ditemukan ", item.pin);
      } else if (findUser !== null) {
        dataIn.push({
          user_id: findUser?.id,
          absen_id: findUser?.absen_id,
          name: findUser.name,
          jam_operasional_group_id: findUser?.jam_operasional_group_id,
          jam_operasional_group_code: findUser?.jam_operasional_group?.code,
          jam_operasional_group: findUser?.jam_operasional_group?.name,
          tipe_absen: findTypeAbsen,
          time: item.time,
          jam_operasional:
            findUser?.jam_operasional_group?.jam_operasional?.map((jam) => ({
              name: jam.name,
              code: jam.code,
              jam_masuk: jam.jam_masuk,
              jam_pulang: jam.jam_pulang,
            })),
        });
      }
    }),
  );

  //data out
  await Promise.all(
    filteredDataOut.map(async (item) => {
      const findUser = await processFindUserByPin(item.pin);

      const findTypeAbsen = await processFindTipeAbsenByCode(item.status);

      if (findUser === null) {
        console.log("find user tidak ditemukan ", item.pin);
      } else if (findUser) {
        dataOut.push({
          user_id: findUser?.id,
          absen_id: findUser?.absen_id,
          name: findUser.name,
          jam_operasional_group_id: findUser?.jam_operasional_group_id,
          jam_operasional_group_code: findUser?.jam_operasional_group?.code,
          jam_operasional_group: findUser?.jam_operasional_group?.name,
          tipe_absen: findTypeAbsen,
          time: item.time,
          jam_operasional:
            findUser?.jam_operasional_group?.jam_operasional?.map((jam) => ({
              name: jam.name,
              code: jam.code,
              jam_masuk: jam.jam_masuk,
              jam_pulang: jam.jam_pulang,
            })),
        });
      }
    }),
  );

  //data in shift
  await Promise.all(
    filteredDataInShift.map(async (item) => {
      const findUser = await processFindUserByPin(item.pin);

      const findTypeAbsen = await processFindTipeAbsenByCode(item.status);

      if (findUser === null) {
        console.log("find user tidak ditemukan ", item.pin);
      } else if (findUser) {
        dataInShift.push({
          user_id: findUser?.id,
          absen_id: findUser?.absen_id,
          name: findUser.name,
          jam_operasional_group_id: findUser?.jam_operasional_group_id,
          jam_operasional_group_code: findUser?.jam_operasional_group?.code,
          jam_operasional_group: findUser?.jam_operasional_group?.name,
          tipe_absen: findTypeAbsen,
          time: item.time,
          jam_operasional:
            findUser?.jam_operasional_group?.jam_operasional?.map((jam) => ({
              name: jam.name,
              code: jam.code,
              jam_masuk: jam.jam_masuk,
              jam_pulang: jam.jam_pulang,
            })),
        });
      }
    }),

    filteredDataOutShift.map(async (item) => {
      const findUser = await processFindUserByPin(item.pin);

      const findTypeAbsen = await processFindTipeAbsenByCode(item.status);

      if (findUser) {
        dataOutShift.push({
          id: findUser?.id,
          absen_id: findUser?.absen_id,
          name: findUser.name,
          jam_operasional_group_id: findUser?.jam_operasional_group_id,
          jam_operasional_group_code: findUser?.jam_operasional_group?.code,
          jam_operasional_group: findUser?.jam_operasional_group?.name,
          absen: findTypeAbsen,
          time: item.time,
          jam_operasional:
            findUser?.jam_operasional_group?.jam_operasional?.map((jam) => ({
              name: jam.name,
              code: jam.code,
              jam_masuk: jam.jam_masuk,
              jam_pulang: jam.jam_pulang,
            })),
        });
      }
    }),
  );

  //data out shift
  await Promise.all(
    filteredDataOutShift.map(async (item) => {
      const findUser = await processFindUserByPin(item.pin);

      const findTypeAbsen = await processFindTipeAbsenByCode(item.status);

      if (findUser === null) {
        console.log("find user tidak ditemukan ", item.pin);
      } else if (findUser) {
        dataOutShift.push({
          user_id: findUser?.id,
          absen_id: findUser?.absen_id,
          name: findUser.name,
          jam_operasional_group_id: findUser?.jam_operasional_group_id,
          jam_operasional_group: findUser?.jam_operasional_group?.name,
          tipe_absen: findTypeAbsen,
          time: item.time,
          jam_operasional:
            findUser?.jam_operasional_group?.jam_operasional?.map((jam) => ({
              name: jam.name,
              code: jam.code,
              jam_masuk: jam.jam_masuk,
              jam_pulang: jam.jam_pulang,
            })),
        });
      }
    }),
  );

  return {
    dataIn,
    dataOut,
    dataInShift,
    dataOutShift,
  };
}

async function processFindJamOperasional(datas) {
  let result = {
    jam_operasional: null,
    pelanggaran_id: null,
  };

  let get_date = new Date(datas.time);
  let time_format = date.format(get_date, "HH:mm:ss");

  const findJamOprasional = await jamOperasionalModel.findOne({
    where: {
      jam_masuk: { [Op.gte]: time_format },
      jam_operasional_group_id: datas.jam_operasional_group_id,
      is_active: 1,
    },
  });

  if (findJamOprasional !== null) {
    result.jam_operasional = findJamOprasional;
    result.pelanggaran_id = 1;
  } else {
    const findLastJamOprasional = await jamOperasionalModel.findAll({
      limit: 1,
      where: {
        jam_operasional_group_id: datas.jam_operasional_group_id,
        is_active: 1,
      },
      order: [["code", "DESC"]],
    });

    result.jam_operasional = findLastJamOprasional[0];
    result.pelanggaran_id = 2;
  }

  return result;
}

async function processFindJamOperasionalShift(datas, field_search) {
  let result = {
    jam_operasional: null,
    pelanggaran_id: null,
  };

  let get_date = new Date(datas.time);
  let time_format = date.format(get_date, "HH:mm:ss");

  const toleranceHour = process.env.TOLERANCE_HOUR;
  const toleranceSecond = toleranceHour * 60 * 60;

  const findJamOprasional = await jamOperasionalModel.findOne({
    where: {
      [Op.and]: [
        literal(`
        ABS(
          TIME_TO_SEC(${field_search}) -
          TIME_TO_SEC('${time_format}')
        ) <= ${toleranceSecond}
      `),
      ],
      jam_operasional_group_id: datas.jam_operasional_group_id,
      is_active: 1,
    },
  });

  if (field_search === "jam_masuk") {
    if (findJamOprasional !== undefined && findJamOprasional !== null) {
      if (findJamOprasional.jam_masuk > time_format) {
        result.jam_operasional = findJamOprasional;
        result.pelanggaran_id = 1;
      } else {
        result.jam_operasional = findJamOprasional;
        result.pelanggaran_id = 2;
      }
    } else {
      result.pelanggaran_id = 2;
    }
  } else if (field_search === "jam_pulang") {
    if (findJamOprasional !== undefined && findJamOprasional !== null) {
      if (findJamOprasional.jam_pulang < time_format) {
        result.jam_operasional = findJamOprasional;
        result.pelanggaran_id = 1;
      } else {
        result.jam_operasional = findJamOprasional;
        result.pelanggaran_id = 2;
      }
    } else {
      result.pelanggaran_id = 2;
    }
  }

  return result;
}

async function processSetupDataInToUpload(datas) {
  let dataReadyToUpload = [];

  for (const item of datas) {
    let get_date = new Date(item.time);
    let time_format = date.format(get_date, "HH:mm:ss");
    let date_time_format = date.format(get_date, "YYYY-MM-DD HH:mm:ss");

    if (item.jam_operasional_group_code === 1) {
      const jam_operasional_checked = await processFindJamOperasional(item);

      dataReadyToUpload.push({
        user_id: item.user_id,
        tipe_absen_id: item.tipe_absen.id,
        tanggal_mulai: date_time_format,
        pelanggaran_id: jam_operasional_checked.pelanggaran_id,
        status_inout_id: 1,
        jam_operasional_id: jam_operasional_checked.jam_operasional.id,
        is_active: true,
      });
    } else if (item.jam_operasional_group_code === 2) {
      const jam_operasional_shift_checked =
        await processFindJamOperasionalShift(item, "jam_masuk");

      if (jam_operasional_shift_checked.jam_operasional !== null) {
        dataReadyToUpload.push({
          user_id: item.user_id,
          tipe_absen_id: item.tipe_absen.id,
          tanggal_mulai: date_time_format,
          pelanggaran_id: jam_operasional_shift_checked.pelanggaran_id,
          status_inout_id: 1,
          jam_operasional_id:
            jam_operasional_shift_checked?.jam_operasional?.id,
          is_active: true,
        });
      }
    }
  }

  return dataReadyToUpload;
}

//prosess setup data out to upload
async function processSetupDataOutToUpload(datas) {
  let dataOutReadyToUpload = [];
  let dataTidakAbsenInReadyToUpload = [];

  for (const item of datas) {
    let get_date = new Date(item.time);
    let time_format = date.format(get_date, "HH:mm:ss");
    let date_format = date.format(get_date, "YYYY-MM-DD");
    let date_time_format = date.format(get_date, "YYYY-MM-DD HH:mm:ss");

    const code_masuk = [0, 8];

    if (item.jam_operasional_group_code === 1) {
      const { is_exist, data } = await processCheckAbsenIsExist(
        item,
        code_masuk,
      );
      const jam_operasional_checked = await processFindJamOperasional(item);

      //cek data in ada apa tidak
      let jam_operasional_id = null;
      let pelanggaran_id = null;

      if (is_exist) {
        jam_operasional_id = data?.jam_operasional_id;
        if (
          data.jam_operasional &&
          data.jam_operasional.jam_pulang < time_format
        ) {
          pelanggaran_id = 1;
        } else {
          pelanggaran_id = 2;
        }
      } else {
        const findLastJamOprasional = await jamOperasionalModel.findAll({
          limit: 1,
          where: {
            jam_operasional_group_id: item.jam_operasional_group_id,
            is_active: 1,
          },
          order: [["code", "DESC"]],
        });

        jam_operasional_id = findLastJamOprasional[0].id;
        pelanggaran_id = 2;

        const code_tidak_absen = 11;

        const findTipeTidakAbsen =
          await processFindTipeAbsenByCode(code_tidak_absen);

        dataTidakAbsenInReadyToUpload.push({
          user_id: item.user_id,
          tipe_absen_id: findTipeTidakAbsen.id,
          tanggal_mulai: date_format + " 00:00:00",
          pelanggaran_id: pelanggaran_id,
          status_inout_id: 1,
          jam_operasional_id: jam_operasional_id,
          is_active: true,
        });
      }

      dataOutReadyToUpload.push({
        user_id: item.user_id,
        tipe_absen_id: item.tipe_absen.id,
        tanggal_mulai: date_time_format,
        pelanggaran_id: pelanggaran_id,
        status_inout_id: 1,
        jam_operasional_id: jam_operasional_id,
        is_active: true,
      });
    } else if (item.jam_operasional_group_code === 2) {
      console.log("jam pulang");
      const jam_operasional_shift_checked =
        await processFindJamOperasionalShift(item, "jam_pulang");

      if (jam_operasional_shift_checked.jam_operasional !== null) {
        dataOutReadyToUpload.push({
          user_id: item.user_id,
          tipe_absen_id: item.tipe_absen.id,
          tanggal_mulai: date_time_format,
          pelanggaran_id: jam_operasional_shift_checked.pelanggaran_id,
          status_inout_id: 1,
          jam_operasional_id:
            jam_operasional_shift_checked?.jam_operasional?.id,
          is_active: true,
        });
      } else {
        console.log(
          "jam operasional no tolerance hour",
          item.name,
          item.tipe_absen.name,
          item.time,
          item.jam_operasional_group,
          jam_operasional_shift_checked?.jam_operasional?.id,
        );
      }
    }
  }

  return { dataOutReadyToUpload, dataTidakAbsenInReadyToUpload };
}

async function processSetupDataInShiftToUpload(datas) {
  let dataInShiftReadyToUpload = [];

  for (const item of datas) {
    let get_date = new Date(item.time);
    let time_format = date.format(get_date, "HH:mm:ss");
    let date_time_format = date.format(get_date, "YYYY-MM-DD HH:mm:ss");
    const jam_operasional_checked = await processFindJamOperasionalShift(
      item,
      "jam_masuk",
    );
    dataInShiftReadyToUpload.push({
      user_id: item.user_id,
      tipe_absen_id: item.tipe_absen.id,
      tanggal_mulai: date_time_format,
      pelanggaran_id: jam_operasional_checked.pelanggaran_id,
      status_inout_id: 1,
      jam_operasional_id: jam_operasional_checked.jam_operasional.id,
      is_active: true,
    });
  }

  return dataInShiftReadyToUpload;
}

async function processSetupDataOutShiftToUpload(datas) {
  let dataInShiftReadyToUpload = [];

  for (const item of datas) {
    let get_date = new Date(item.time);
    let time_format = date.format(get_date, "HH:mm:ss");
    let date_time_format = date.format(get_date, "YYYY-MM-DD HH:mm:ss");
    const jam_operasional_checked = await processFindJamOperasionalShift(
      item,
      "jam_pulang",
    );
    dataInShiftReadyToUpload.push({
      user_id: item.user_id,
      tipe_absen_id: item.tipe_absen.id,
      tanggal_mulai: date_time_format,
      pelanggaran_id: jam_operasional_checked.pelanggaran_id,
      status_inout_id: 1,
      jam_operasional_id: jam_operasional_checked.jam_operasional.id,
      is_active: true,
    });
  }

  return dataInShiftReadyToUpload;
}

async function processSubmitData(datas) {
  const result = await inOutModel.create({
    user_id: datas.user_id,
    tipe_absen_id: datas.tipe_absen_id,
    tanggal_mulai: datas.tanggal_mulai,
    tanggal_selesai: datas.tanggal_selesai,
    pelanggaran_id: datas.pelanggaran_id,
    status_inout_id: datas.status_inout_id,
    jam_operasional_id: datas.jam_operasional_id,
    is_active: datas.is_active,
  });

  return result;
}

//this mecine core to data process
async function processDataCoreFinger(params) {
  const { ip_mesin, start_date, end_date } = params;

  const { dataIn, dataOut, dataInShift, dataOutShift } =
    await processFilterData({
      ip_mesin,
      start_date,
      end_date,
    });

  // check data already exist
  for (const item of dataIn) {
    const code_masuk = [0, 8];
    const { is_exist } = await processCheckAbsenIsExist(item, code_masuk);
    item.is_exist = is_exist;
  }

  for (const item of dataOut) {
    const code_pulang = [1, 9];
    const { is_exist } = await processCheckAbsenIsExist(item, code_pulang);
    item.is_exist = is_exist;
  }

  for (const item of dataInShift) {
    const code_masuk_shift = [4];
    const { is_exist } = await processCheckAbsenIsExist(item, code_masuk_shift);
    item.is_exist = is_exist;
  }

  for (const item of dataOutShift) {
    const code_pulang_shift = [5];
    const { is_exist } = await processCheckAbsenIsExist(
      item,
      code_pulang_shift,
    );
    item.is_exist = is_exist;
  }

  // filter data is not exist on database
  const filteredDataIn = (
    await Promise.all(
      dataIn.map(async (item) => {
        return item.is_exist ? null : item;
      }),
    )
  ).filter(Boolean);

  const filteredDataOut = (
    await Promise.all(
      dataOut.map(async (item) => {
        return item.is_exist ? null : item;
      }),
    )
  ).filter(Boolean);

  const filteredDataInShift = (
    await Promise.all(
      dataInShift.map(async (item) => {
        return item.is_exist ? null : item;
      }),
    )
  ).filter(Boolean);

  const filteredDataOutShift = (
    await Promise.all(
      dataOutShift.map(async (item) => {
        return item.is_exist ? null : item;
      }),
    )
  ).filter(Boolean);

  //setup data in with format push database
  const dataInReadyToUpload = await processSetupDataInToUpload(filteredDataIn);

  //push data in to database
  await dataInReadyToUpload.map(async (item) => {
    await processSubmitData(item);
  });

  //cek and delete data double in
  for (const item of dataIn) {
    const code_masuk = [0, 8];
    const delete_data_double = await processFilterDataDouble(item, code_masuk);
  }

  //setup data out with format push database
  const { dataOutReadyToUpload, dataTidakAbsenInReadyToUpload } =
    await processSetupDataOutToUpload(filteredDataOut);

  // push data tidak absen to database
  await dataTidakAbsenInReadyToUpload.map(async (item) => {
    await processSubmitData(item);
  });

  // push data out to database
  await dataOutReadyToUpload.map(async (item) => {
    await processSubmitData(item);
  });

  // cek and delete data double out
  for (const item of dataOut) {
    const code_pulang = [1, 9];
    const delete_data_double = await processFilterDataDouble(item, code_pulang);
  }

  //setup data In Shift with format push database
  const dataInShiftReadyToUpload =
    await processSetupDataInShiftToUpload(filteredDataInShift);

  await dataInShiftReadyToUpload.map(async (item) => {
    await processSubmitData(item);
  });

  // cek and delete data double out
  for (const item of dataOut) {
    const code_masuk_shift = [4];
    const delete_data_double = await processFilterDataDouble(
      item,
      code_masuk_shift,
    );
  }

  //setup data Out Shift with format push database
  const dataOutShiftReadyToUpload =
    await processSetupDataOutShiftToUpload(filteredDataOutShift);

  await dataOutShiftReadyToUpload.map(async (item) => {
    await processSubmitData(item);
  });

  // cek and delete data double out
  for (const item of dataOut) {
    const code_pulang_shift = [5];
    const delete_data_double = await processFilterDataDouble(
      item,
      code_pulang_shift,
    );
  }

  return {
    dataIn,
    dataOut,
    dataInShift,
    dataOutShift,
    filteredDataIn,
    filteredDataOut,
    filteredDataInShift,
    filteredDataOutShift,
    dataInReadyToUpload,
    dataOutReadyToUpload,
    dataTidakAbsenInReadyToUpload,
    dataInShiftReadyToUpload,
    dataOutShiftReadyToUpload,
  };
}

const getDataFingerWithCron = async (req, res) => {
  try {
    const mesin = await mesinAbsenModel.findAll({
      where: {
        is_active: 1,
      },
    });

    const result = [];

    for (const item of mesin) {
      try {
        console.log("start", item.ip_mesin);

        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - item.day);

        const start_date = date.format(startDate, "YYYY-MM-DD");
        const end_date = date.format(endDate, "YYYY-MM-DD");

        await processDataCoreFinger({
          ip_mesin: item.ip_mesin,
          start_date,
          end_date,
        });

        result.push({
          lokasi: item.name,
          ip_mesin: item.ip_mesin,
          status: "success",
          start_date,
          end_date,
        });

        console.log("stop", item.ip_mesin);
      } catch (error) {
        console.log("error", error.message);
        result.push({
          lokasi: item.name,
          ip_mesin: item.ip_mesin,
          status: "error",
          message: error.message,
        });
        continue;
      }
    }

    console.log("finished process...");

    return res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};

const getDataFinger = async (req, res) => {
  const { ip_mesin, start_date, end_date } = req.query;

  try {
    const {
      dataIn,
      dataOut,
      dataInShift,
      dataOutShift,
      filteredDataIn,
      filteredDataOut,
      filteredDataInShift,
      filteredDataOutShift,
      dataInReadyToUpload,
      dataOutReadyToUpload,
      dataTidakAbsenInReadyToUpload,
      dataInShiftReadyToUpload,
      dataOutShiftReadyToUpload,
    } = await processDataCoreFinger({ ip_mesin, start_date, end_date });

    return res.status(200).json({
      status: "success",
      total: [
        dataIn.length,
        dataOut.length,
        dataInShift.length,
        dataOutShift.length,
      ],
      filtered_total: [
        filteredDataIn.length,
        filteredDataOut.length,
        filteredDataInShift.length,
        filteredDataOutShift.length,
      ],
      total_data_ready: [
        dataInReadyToUpload.length,
        dataOutReadyToUpload.length,
        dataTidakAbsenInReadyToUpload.length,
        dataInShiftReadyToUpload.length,
        dataOutShiftReadyToUpload.length,
      ],
      filteredDataIn,
      dataInReadyToUpload,
      filteredDataOut,
      dataOutReadyToUpload,
      dataTidakAbsenInReadyToUpload,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getDataFinger,
  getDataFingerWithCron,
};
