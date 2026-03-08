// services/fe/ticket.service.js

const { Event, Ticket, OrderItem, TicketType } = require("../../../models");
const crypto = require("crypto");
const { generateSignature } = require("../../utils/qrSignature");

module.exports = {

  async generateTickets(orderId, transaction) {

    // ==============================
    // LOAD ORDER ITEMS
    // ==============================

    const items = await OrderItem.findAll({
      where: { order_id: orderId },
      include: [
        {
          model: TicketType,
          as: "ticket_type",
          attributes: ["id", "event_id"]
        }
      ],
      transaction
    });

    if (!items.length) return;

    // ==============================
    // LOAD EVENT ONCE
    // ==============================

    const eventId = items[0].ticket_type.event_id;

    const event = await Event.findByPk(eventId, {
      attributes: ["creator_id"],
      transaction
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const creatorId = event.creator_id;

    // ==============================
    // BUILD TICKET PAYLOAD
    // ==============================

    const payload = [];

    for (const item of items) {

      let attendees;

      try {

        attendees = Array.isArray(item.attendees)
          ? item.attendees
          : JSON.parse(item.attendees);

      } catch (err) {

        console.error("Invalid attendee format", item.id);
        continue;

      }

      for (const a of attendees) {

        const code = "BLSNG-" + crypto.randomBytes(8).toString("hex");

        const signature = generateSignature(code, eventId);

        const qrPayload = {
          t: code,
          e: eventId,
          s: signature
        };

        payload.push({

          order_item_id: item.id,

          creator_id: creatorId,

          event_id: eventId,

          ticket_type_id: item.ticket_type_id,

          ticket_code: code,

          owner_name: a.name,
          owner_email: a.email,
          owner_phone: a.phone,

          type_identity: a.type_identity,
          no_identity: a.no_identity,

          qr_payload: JSON.stringify(qrPayload),

          status: "issued",

          issued_at: new Date()

        });

      }

    }

    if (!payload.length) return;

    // ==============================
    // BULK INSERT TICKETS
    // ==============================

    await Ticket.bulkCreate(payload, {
      transaction,
      validate: true
    });

  }

};