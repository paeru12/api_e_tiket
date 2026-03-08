const { Event, Creator, Kategori, User, sequelize, TicketType, GuestStars, Sponsors, Fasilitas, EventFasilitas, EventStaffAssignment } = require("../../../models");
const slugify = require("../../utils/slugify");
const deleteImage = require("../../utils/deleteImage");
const { Op } = require("sequelize");
module.exports = {
  async getOne(eventId) {
    const event = await Event.findByPk(eventId, {
      include: [
        { model: User, as: 'users', attributes: ['full_name', 'image'] },
        { model: Creator, as: 'creators', attributes: ['name', 'slug'] },
        { model: Kategori, as: 'kategoris', attributes: ['name', 'slug'] },
        { model: TicketType, as: 'ticket_types' },
        { model: GuestStars, as: 'guest_stars', attributes: ["id", "name", "image"] },
        { model: Sponsors, as: 'sponsors', attributes: ["id", "name", "image"] },
        { model: Fasilitas, as: 'fasilitas_event', through: { attributes: [] }, attributes: ["id", "name", "icon"] },
        {
          model: EventStaffAssignment,
          as: "scan_staffs",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "full_name"]
            }
          ]
        }
      ],
      paranoid: false,
    });
    if (event.social_link) {
      try {
        event.social_link = JSON.parse(event.social_link);
      } catch (e) {
        event.social_link = null;
      }
    }
    return event;
  },

  async getPagination({ page = 1, perPage = 10, search = "", creator_id }) {
    const limit = parseInt(perPage);
    const offset = (page - 1) * limit;

    const where = {
      ...(creator_id ? { creator_id } : {}),
      ...(search ? {
        [Op.or]: [{ name: { [Op.like]: `%${search}%` } }]
      } : {})
    };

    const { rows, count } = await Event.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["deleted_at"] },
      include: [
        { model: User, attributes: ['full_name', 'image'], as: 'users' },
        { model: Creator, attributes: ['name', 'slug'], as: 'creators' },
        { model: Kategori, attributes: ['name', 'slug'], as: 'kategoris' },
        { model: TicketType, as: 'ticket_types' },
      ],
    });

    return {
      rows,
      count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit),
    };
  },

  async getAll(creator_id) {
    return await Event.findAll({
      where: creator_id ? { creator_id } : {},
      order: [["created_at", "DESC"]],
      attributes: ["id", "name"],
      paranoid: false
    });
  },

  async getBySlug(slug) {
    return await Event.findOne({
      where: { slug: slug },
      attributes: { exclude: ["user_id", "kategori_id", "creator_id", "created_at", "updated_at", "deleted_at"] },
      include: [
        { model: User, attributes: ['full_name', 'image'] },
        { model: Creator, attributes: ['name', 'slug'] },
        { model: Kategori, attributes: ['name', 'slug'] },
      ],
    });
  },

  async create(data) {
    data.slug = slugify(data.name);
    return await Event.create(data);
  },

  async createAll(data) {
    const transaction = await sequelize.transaction();

    try {
      data.slug = slugify(data.name);

      const event = await Event.create(data, { transaction });
      if (data.ticket_types && Array.isArray(data.ticket_types) && data.ticket_types.length > 0) {

        const tickets = data.ticket_types.map(t => ({
          ...t,
          event_id: event.id
        }));

        await TicketType.bulkCreate(tickets, { transaction });

        const lowestPrice = Math.min(
          ...tickets.map(t => Number(t.price))
        );

        await event.update(
          { lowest_price: lowestPrice },
          { transaction }
        );
      }

      await transaction.commit();
      return event;

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async update(eventId, data) {
    const event = await Event.findByPk(eventId);
    if (!event) throw new Error("Event not found");

    if (data.name) data.slug = slugify(data.name);

    if (data.image && event.image) deleteImage(event.image);
    if (data.layout_venue && event.layout_venue) deleteImage(event.layout_venue);

    await event.update(data);
    return event;
  },

  async remove(eventId) {
    const event = await Event.findByPk(eventId);
    if (!event) throw new Error("Event not found");

    await event.destroy();
    return { message: "Event deleted" };
  },

  async createGuestStar(data) {
    return await GuestStars.create(data);
  },

  async deleteGuestStar(id) {
    const gs = await GuestStars.findByPk(id);
    if (!gs) throw new Error("Guest star not found");

    if (gs.image) deleteImage(gs.image);
    return gs.destroy();
  },

  async createSponsor(data) {
    return await Sponsors.create(data);
  },

  async deleteSponsor(id) {
    const sp = await Sponsors.findByPk(id);
    if (!sp) throw new Error("Sponsor not found");

    if (sp.image) deleteImage(sp.image);
    return sp.destroy();
  },

  async addFasilitasToEvent(eventId, fasilitasId) {
    return await EventFasilitas.create({ event_id: eventId, fasilitas_id: fasilitasId });
  },

  async removeFasilitasFromEvent(eventId, fasilitasId) {
    return await EventFasilitas.destroy({
      where: { event_id: eventId, fasilitas_id: fasilitasId },
    });
  },

  async assignScanStaff(data) {

    const existing = await EventStaffAssignment.findOne({
      where: {
        event_id: data.event_id,
        user_id: data.user_id,
        assigned_gate: data.gate
      }
    });

    if (existing) {
      throw new Error("Staff already assigned to this gate");
    }

    return await EventStaffAssignment.create({
      creator_id: data.creator_id,
      event_id: data.event_id,
      user_id: data.user_id,
      assigned_gate: data.gate,
      role: "scanner",
      status: "pending",
      is_active: true,
      created_by: data.created_by
    });

  },

  async removeScanStaff(id) {

    const staff = await EventStaffAssignment.findByPk(id);

    if (!staff) throw new Error("Assignment not found");

    await staff.destroy();

    return true;

  },
};
