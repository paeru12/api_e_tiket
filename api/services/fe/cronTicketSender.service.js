const {

  Ticket,

  TicketType,

  Event,

  OrderItem,

  Order

} = require("../../../models");

const { Op } = require("sequelize");

const ticketEmailQueue =
  require("../../../queues/ticketEmail.queue");

const {

  acquireLock,

  releaseLock

} = require("../../../utils/redisLock");


const LIMIT = 200;


module.exports = {

  async sendTickets() {

    const lockKey =
      "cron:ticketSender";


    const locked =
      await acquireLock(

        lockKey,

        55

      );


    if (!locked) {

      console.log(
        "cron locked"
      );

      return;

    }


    try {

      const now = new Date();


      const tickets =
        await Ticket.findAll({

          where: {

            status: "issued",

            sent_at: null

          },

          include: [

            {

              model: TicketType,

              as: "ticket_type",

              required: true,

              where: {

                [Op.or]: [

                  {

                    deliver_ticket:
                      null

                  },

                  {

                    deliver_ticket: {

                      [Op.lte]: now

                    }

                  }

                ]

              }

            },

            {

              model: Event,

              as: "event",

              required: true

            },

            {

              model: OrderItem,

              as: "orderitem",

              include: [

                {

                  model: Order,

                  as: "order",

                  attributes: [

                    "id",

                    "customer_email",

                    "customer_name"

                  ]

                }

              ]

            }

          ],

          limit: LIMIT

        });


      if (!tickets.length) {

        console.log(
          "No ticket ready"
        );

        return;

      }


      /* group by order */

      const orderMap = {};


      for (const t of tickets) {

        const orderId =
          t.orderitem.order.id;


        if (!orderMap[orderId]) {

          orderMap[orderId] = {

            order:
              t.orderitem.order,

            event:
              t.event,

            tickets: []

          };

        }


        orderMap[
          orderId
        ].tickets.push(t);

      }


      const orders =
        Object.values(orderMap);


      console.log(
        `Queue ${orders.length} email jobs`
      );


      for (const group of orders) {

        await ticketEmailQueue.add(

          "sendTicket",

          group

        );

      }

    }

    finally {

      await releaseLock(

        lockKey

      );

    }

  }

};