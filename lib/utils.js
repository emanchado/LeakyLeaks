function excerpt(text, limit) {
    if (text.length <= limit) {
        return text;
    } else {
        var excerpt = text.substr(0, limit + 1);
        return excerpt.replace(/ +[^ ]*$/, '') + "...";
    }
}

var cablesPerPage = 10;

function pageInfo(cables, page) {
    var firstCable = 1 + cablesPerPage * (page - 1);
    var lastCable  = Math.min(cables.length, firstCable + cablesPerPage - 1)
    var pageCables = cables.slice(firstCable - 1,
                                  firstCable - 1 + cablesPerPage);
    var totalPages = Math.ceil(cables.length / cablesPerPage);
    if (firstCable > cables.length || page < 1 || page > totalPages) {
        firstCable = lastCable = 0;
    }
    return {firstCable: firstCable,
            lastCable:  lastCable,
            cables:     pageCables,
            totalCables: cables.length,
            totalPages: totalPages};
}
