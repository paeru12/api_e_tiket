const { User, Role, UserRole, sequelize } = require("../../../models");
const bcrypt = require("../../../utils/bcrypt");
const deleteImage = require("../../utils/deleteImage");
const { Op } = require("sequelize");
const ROLES = require("../../config/role");
module.exports = {

  async getPagination({ page = 1, perPage = 10, search = "" }) {
    const limit = parseInt(perPage);
    const offset = (page - 1) * limit;
    const where = {};
    if (search) {
            where["$user.full_name$"] = { [Op.like]: `%${search}%` };
            where["$user.email$"] = { [Op.like]: `%${search}%` };
            where["$user.phone$"] = { [Op.like]: `%${search}%` };
        }
    const { rows, count } = await UserRole.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["full_name", "email", "phone","image", "is_active"],
          paranoid: true,
          required: true
        },
        {
          model: Role,
          as: "role",
          attributes: ["name"]
        },
      ],
      order: [["created_at", "ASC"]]
    });

    return {
      rows,
      count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit)
    };
  },

  async getOne(id) {
    const user = await User.findByPk(id, {
      include: [{ model: Role, as: "roles", through: { attributes: [] } }],
      attributes: { exclude: ["password_hash"] }
    });
    if (!user) throw new Error("User not found");
    const img = user.image ? process.env.MEDIA_URL_AUTH + user.image : null;

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      image: img,
      is_active: user.is_active,
      role: user.roles[0]?.name || null
    };
  },

  async createAdmin(data) {
    

    salt = process.env.BCRYPT_SALT || 10;
    const hashed = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      full_name: data.full_name,
      email: data.email,
      password_hash: hashed,
      phone: data.phone,
      image: data.image || null
    });

    let role_id = null;
    if (data.role === "SYSTEM_ADMIN") {
      role_id = ROLES.SYSTEM_ADMIN_ID
    } else if (data.role === "CONTENT_WRITER") {
      role_id = ROLES.CONTENT_WRITER_ID
    }

    await UserRole.create({
      user_id: user.id,
      role_id,
      created_at: new Date()
    });

    return await User.findByPk(user.id, {
      include: [{ model: Role, as: "roles", through: { attributes: [] } }],
      attributes: { exclude: ["password_hash"] }
    });
  },

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    if (data.image && user.image) {
      deleteImage(user.image);
    }

    await user.update(data);
    return user;
  },

  async updateGlobalPassword(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(data.current_password, user.password_hash);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }
    if (data.password !== data.confirm_password) {
      throw new Error("Password and confirm password do not match");
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    const password_hash = await bcrypt.hash(data.password, saltRounds);
    await user.update({ password_hash });
    return { message: "Password updated successfully" };
  },

  async remove(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    if (user.image) {
      deleteImage(user.image);
    }

    await user.destroy();
    return { message: "User deleted" };
  },

}; 
