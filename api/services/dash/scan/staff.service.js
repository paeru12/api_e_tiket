const { EventStaffAssignment, Event } = require("../../../../models");
const { v4: uuid } = require("uuid");

module.exports = {

  async assignStaff(payload) {

    const {
      creator_id,
      event_id,
      user_id,
      assigned_gate,
      created_by
    } = payload;

    return await EventStaffAssignment.create({

      id: uuid(),

      creator_id,
      event_id,
      user_id,

      assigned_gate,

      role: "scanner",

      status: "pending",

      created_by

    });

  },

  async acceptAssignment(payload) {

    const { assignment_id } = payload;

    const assignment = await EventStaffAssignment.findByPk(assignment_id);

    if (!assignment) throw new Error("Assignment not found");

    assignment.status = "accepted";
    assignment.accepted_at = new Date();

    await assignment.save();

    return assignment;

  },

  async myAssignments(userId) {

    return await EventStaffAssignment.findAll({

      where: {
        user_id: userId,
        status: "accepted",
        is_active: true
      }

    });

  },

  async getAssignedEvents(userId) {

    return await EventStaffAssignment.findAll({

      where: {
        user_id: userId,
        status: ["accepted", "pending"],
        is_active: true
      },

      include: [
        {
          model: Event,
          as: "event",
          attributes: [
            "id",
            "name",
            "date_start",
            "time_start",
            "image"
          ]
        }
      ]

    });

  },

  async acceptAssignment(id, userId) {

    const assignment = await EventStaffAssignment.findByPk(id);

    if (!assignment)
      throw new Error("Assignment not found");

    if (assignment.user_id !== userId)
      throw new Error("Unauthorized assignment");

    if (assignment.status === "accepted")
      return assignment;

    await assignment.update({
      status: "accepted",
      accepted_at: new Date()
    });

    return assignment;

  }

};