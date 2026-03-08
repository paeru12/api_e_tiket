
module.exports = {
  async province() {
    try {
      const response = await fetch('https://wilayah.id/api/provinces.json');
      const data = await response.json();
      return await data;
    } catch (error) {
      throw new Error("Failed to fetch provinces");
    }
  },

  async district(provinceId) {
    try {
      const response = await fetch(`https://wilayah.id/api/regencies/${provinceId}.json`);
      const data = await response.json();
      return await data;
    } catch (error) {
      throw new Error("Failed to fetch districts");
    }
  }
};
