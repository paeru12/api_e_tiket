const { User, Role, UserRole } = require("../../models");
const bcrypt = require("../../utils/bcrypt");
const deleteImage = require("../utils/deleteImage");

module.exports = {
  async getAll() {
    return await User.findAll({
      include: [{ model: Role, through: { attributes: [] } }],
      attributes: { exclude: ["password_hash"] }
    });
  },

  async getOne(id) {
    const user = await User.findByPk(id, {
      include: [{ model: Role, through: { attributes: [] } }],
      attributes: { exclude: ["password_hash"] }
    });
    if (!user) throw new Error("User not found");
    return user;
  },

  async create(data) {
    const role = await Role.findByPk(data.role_id);
    if (!role) throw new Error("Role not found");

    const hashed = await bcrypt.hash(data.password);

    const user = await User.create({
      full_name: data.full_name,
      email: data.email,
      password_hash: hashed,
      phone: data.phone,
      image: data.image || null
    });

    // Assign role
    await UserRole.create({
      user_id: user.id,
      role_id: role.id,
      created_at: new Date()
    });

    return await User.findByPk(user.id, {
      include: [{ model: Role, through: { attributes: [] } }],
      attributes: { exclude: ["password_hash"] }
    });

  },

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    // 🔥 hapus avatar lama jika diganti
    if (data.image && user.image) {
      deleteImage(user.image);
    }

    await user.update(data);
    return user;
  },

  async remove(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    // 🔥 hapus avatar saat delete user
    if (user.image) {
      deleteImage(user.image);
    }

    await user.destroy();
    return { message: "User deleted" };
  },

  async assignRole(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    const role = await Role.findByPk(data.role_id);
    if (!role) throw new Error("Role not found");

    // Cegah duplikasi
    const exists = await UserRole.findOne({
      where: { user_id: id, role_id: data.role_id }
    });

    if (exists) throw new Error("User already has this role");

    await UserRole.create({
      user_id: id,
      role_id: data.role_id,
      created_at: new Date()
    });

    return { message: "Role assigned" };
  }
};
