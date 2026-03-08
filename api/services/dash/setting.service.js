const { SystemFinanceSettings, CreatorFinanceSettings } = require("../../../models");

module.exports = {
  // Ambil data pajak saat ini
  async getTaxRate() {
    return await SystemFinanceSettings.findOne(); // Mengambil 1 record karena hanya ada satu pengaturan
  },

  async getAdminFee(creator_id){
    const data = await CreatorFinanceSettings.findOne({where: {creator_id}})
    return data;
  },

  // Memperbarui tarif pajak
  async updateTaxRate(tax_rate, service_tax_rate) {
    const systemFinanceSetting = await SystemFinanceSettings.findOne();

    if (!systemFinanceSetting) {
      throw new Error("Pengaturan pajak tidak ditemukan");
    }

    systemFinanceSetting.tax_rate = tax_rate;
    systemFinanceSetting.service_tax_rate = service_tax_rate;

    // Simpan perubahan ke database
    await systemFinanceSetting.save();
  },
};