exports.buildPagination = (page, limit, count) => {

    const totalPages = Math.ceil(count / limit);

    return {
        currentPage: page,
        limit,
        totalCount: count,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null
    };
};