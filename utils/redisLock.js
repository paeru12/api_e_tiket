const redisClient = require("./redis");

async function acquireLock(

    key,

    ttl = 50

) {

    const lock =
        await redisClient.set(

            key,

            "1",

            {

                NX: true,

                EX: ttl

            }

        );

    return lock === "OK";

}


async function releaseLock(

    key

) {

    await redisClient.del(key);

}


module.exports = {

    acquireLock,

    releaseLock

};