const cache = require("../../../utils/cache");

const {
  Event,
  Ticket,
  TicketType,
  TicketScanLog,
  EventStaffAssignment,
  TicketDailyUsage
} = require("../../../../models");

const { verifySignature } = require("../../../utils/qrSignature");
const { v4: uuid } = require("uuid");

function getWIBNow() {
  const now = new Date();
  return new Date(now.getTime());
}

module.exports = {

  async scanTicket(payload) {

    const {
      ticket_code,
      event_id,
      signature,
      gate,
      device_id,
      scan_source,
      user_id
    } = payload;

    // =========================
    // VERIFY SIGNATURE
    // =========================

    if (!verifySignature(ticket_code, event_id, signature)) {
      throw new Error("Invalid ticket signature");
    }

    // =========================
    // ASSIGNMENT CACHE
    // =========================

    const assignmentCacheKey = `assignment:${event_id}:${user_id}:${gate}`;

    let assignment = cache.get(assignmentCacheKey);

    if (!assignment) {

      assignment = await EventStaffAssignment.findOne({
        where: {
          event_id,
          user_id,
          assigned_gate: gate,
          status: "accepted",
          is_active: true
        },
        attributes: ["id", "creator_id"]
      });

      if (!assignment) {
        throw new Error("Scanner not assigned to this gate");
      }

      cache.set(assignmentCacheKey, assignment, 300);
    }

    // =========================
    // TICKET CACHE
    // =========================

    const ticketCacheKey = `ticket:${ticket_code}`;

    let ticket = cache.get(ticketCacheKey);

    if (!ticket) {

      ticket = await Ticket.findOne({
        where: { ticket_code, event_id },
        attributes: ["id", "ticket_code", "owner_name", "used_at"],
        include: [
          {
            model: TicketType,
            as: "ticket_type",
            attributes: ["ticket_usage_type"]
          }
        ]
      });

      if (!ticket) {
        throw new Error("Invalid ticket");
      }

      cache.set(ticketCacheKey, ticket, 60);
    }

    const usageType = ticket.ticket_type.ticket_usage_type;

    // =========================
    // EVENT CACHE
    // =========================

    const eventCacheKey = `event:${event_id}`;

    let event = cache.get(eventCacheKey);

    if (!event) {

      event = await Event.findByPk(event_id, {
        attributes: ["date_start", "date_end", "time_start", "time_end"]
      });

      if (!event) {
        throw new Error("Event not found");
      }

      cache.set(eventCacheKey, event, 300);
    }

    // =========================
    // EVENT DATE & TIME VALIDATION
    // =========================

    const now = getWIBNow();
    const today = now.toISOString().slice(0, 10);
    const currentTime = now.toTimeString().slice(0, 8);
    console.log(now, today, currentTime);
    const eventStartDate = event.date_start;
    const eventEndDate = event.date_end;

    if (today < eventStartDate) {
      throw new Error("Event belum dimulai");
    }

    if (today > eventEndDate) {
      throw new Error("Event sudah berakhir");
    }

    const eventStartTime = event.time_start;
    const eventEndTime = event.time_end;

    if (today === eventStartDate && currentTime < eventStartTime) {
      throw new Error("Event belum dibuka");
    }

    if (today === eventEndDate && currentTime > eventEndTime) {
      throw new Error("Event sudah ditutup");
    }
    // =========================
    // SINGLE ENTRY
    // =========================

    if (usageType === "single_entry") {

      const updated = await Ticket.update({
        status: "used",
        used_at: now,
        used_by: user_id
      }, {
        where: {
          id: ticket.id,
          used_at: null
        }
      });

      if (updated[0] === 0) {

        await logScan({
          assignment,
          ticket,
          event_id,
          gate,
          device_id,
          scan_source,
          user_id,
          ticket_code,
          now,
          result: "duplicate",
          message: "Ticket already used"
        });

        throw new Error("Ticket already used");
      }

      cache.del(ticketCacheKey);

    }

    // =========================
    // DAILY ENTRY
    // =========================

    if (usageType === "daily_entry") {

      const dailyCacheKey = `daily:${ticket.id}:${today}`;

      if (cache.get(dailyCacheKey)) {
        throw new Error("Ticket already used today");
      }

      const existing = await TicketDailyUsage.findOne({
        where: {
          ticket_id: ticket.id,
          usage_date: today
        }
      });

      if (existing) {
        throw new Error("Ticket already used today");
      }

      await TicketDailyUsage.create({
        id: uuid(),
        ticket_id: ticket.id,
        event_id,
        usage_date: today,
        used_at: now,
        scanned_by: user_id,
        gate,
        created_at: now
      });

      cache.set(dailyCacheKey, true, 86400);

    }

    // =========================
    // SUCCESS LOG LIMIT
    // =========================

    const logKey = `log:${ticket.id}`;

    const logCount = cache.get(logKey) || 0;

    if (logCount < 2) {

      await TicketScanLog.create({
        id: uuid(),
        creator_id: assignment.creator_id,
        ticket_id: ticket.id,
        event_id,
        scanned_by: user_id,
        gate,
        device_id,
        scan_source,
        raw_qr_payload: ticket_code,
        result: "success",
        message: "Ticket valid",
        scanned_at: now
      });

      cache.set(logKey, logCount + 1, 86400);

    }

    return {
      ticket_code: ticket.ticket_code,
      owner_name: ticket.owner_name,
      usage_type: usageType,
      status: "valid"
    };

  }

};

async function logScan({
  assignment,
  ticket,
  event_id,
  gate,
  device_id,
  scan_source,
  user_id,
  ticket_code,
  now,
  result,
  message
}) {

  await TicketScanLog.create({
    id: uuid(),
    creator_id: assignment.creator_id,
    ticket_id: ticket.id,
    event_id,
    scanned_by: user_id,
    gate,
    device_id,
    scan_source,
    raw_qr_payload: ticket_code,
    result,
    message,
    scanned_at: now
  });

}