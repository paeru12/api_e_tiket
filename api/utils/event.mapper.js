exports.mapEvent = (event) => {

    return {
        id: event.id,

        image: event.image
            ? process.env.MEDIA_URL_FRONTEND + event.image
            : null,

        name: event.name,

        dateStart: event.date_start,
        timeStart: event.time_start,

        dateEnd: event.date_end,
        timeEnd: event.time_end,

        status: event.status,

        location: event.location,
        province: event.province,
        city: event.district,

        slug: event.slug,

        lowestPrice: event.lowest_price,

        creator: event.creators
            ? {
                name: event.creators.name,
                username: event.creators.slug,
                photoProfile: event.creators.image
                    ? process.env.MEDIA_URL_FRONTEND + event.creators.image
                    : null
            }
            : null
    };

};