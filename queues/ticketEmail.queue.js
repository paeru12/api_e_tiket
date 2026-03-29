const { Queue } = require("bullmq");

const connection = require("../utils/redisBull");

const ticketEmailQueue = new Queue(

  "ticketEmail",

  {

    connection,

    defaultJobOptions: {

      attempts: 3,

      backoff: {

        type: "exponential",

        delay: 5000

      },

      removeOnComplete: true,

      removeOnFail: false

    }

  }

);

module.exports = ticketEmailQueue;