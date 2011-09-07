function excerpt(text, limit) {
    if (text.length <= limit) {
        return text;
    } else {
        var excerpt = text.substr(0, limit + 1);
        return excerpt.replace(/ +[^ ]*$/, '') + "...";
    }
}
