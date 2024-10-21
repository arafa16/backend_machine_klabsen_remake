'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.belongsTo(models.status,{
        foreignKey:"status_id"
      });
      user.belongsTo(models.gander,{
        foreignKey:"gander_id"
      });
      user.belongsTo(models.pendidikan,{
        foreignKey:"pendidikan_id"
      });
      user.belongsTo(models.jabatan,{
        foreignKey:"jabatan_id"
      });
      user.belongsTo(models.privilege,{
        foreignKey:"privilege_id"
      });
      user.belongsTo(models.penempatan,{
        foreignKey:"penempatan_id"
      });
      user.belongsTo(models.status_perkawinan,{
        foreignKey:"status_perkawinan_id"
      });
      user.belongsTo(models.contact_emergency,{
        foreignKey:"contact_emergency_id"
      });
      user.belongsTo(models.bank,{
        foreignKey:"bank_id"
      });
      user.belongsTo(models.golongan_darah,{
        foreignKey:"golongan_darah_id"
      });
      user.belongsTo(models.jam_operasional_group,{
        foreignKey:"jam_operasional_group_id"
      });
      user.belongsTo(models.group,{
        foreignKey:"group_id"
      });
      user.belongsTo(models.status,{
        foreignKey:"status_id"
      });
      user.belongsTo(models.privilege,{
        foreignKey:"privilege_id"
      });
      user.belongsTo(user, {
        as: 'atasan', foreignKey: 'atasan_id'
      });
    }
  }
  user.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    absen_id: DataTypes.STRING,
    nik: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    url_image: DataTypes.TEXT,
    gander_id: DataTypes.INTEGER,
    extention: DataTypes.STRING,
    nomor_hp: DataTypes.STRING,
    penempatan_id: DataTypes.INTEGER,
    jabatan_id: DataTypes.INTEGER,
    atasan_id: DataTypes.INTEGER,
    nomor_ktp: DataTypes.STRING,
    alamat_ktp: DataTypes.STRING,
    alamat_domisili: DataTypes.STRING,
    tempat_lahir: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATE,
    nomor_npwp: DataTypes.STRING,
    status_perkawinan_id: DataTypes.INTEGER,
    jumlah_anak: DataTypes.INTEGER,
    nama_ibu: DataTypes.STRING,
    pendidikan_id: DataTypes.INTEGER,
    nama_sekolah: DataTypes.STRING,
    jurusan_sekolah: DataTypes.STRING,
    tahun_lulus: DataTypes.INTEGER,
    ipk: DataTypes.STRING,
    nomor_bpjs_kesehatan: DataTypes.STRING,
    contact_emergency_id: DataTypes.INTEGER,
    emergency_number: DataTypes.STRING,
    emergancy_address: DataTypes.STRING,
    nomor_sim: DataTypes.STRING,
    golongan_darah_id: DataTypes.INTEGER,
    bank_id: DataTypes.INTEGER,
    nomor_rekening: DataTypes.STRING,
    jam_operasional_group_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    quote: DataTypes.STRING,
    privilege_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    is_atasan: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
  });
  return user;
};