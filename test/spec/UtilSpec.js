describe("Utils", function() {
    it("should correctly calculate a bigger excerpt than the text", function() {
        var text = "SECRET TEHRAN 2077 Declassified";
        expect(excerpt(text, 50)).toEqual(text);
    });

    it("should correctly calculate an excerpt as long as the text", function() {
        var text = "SECRET TEHRAN 2077 Declassified";
        expect(excerpt(text, text.length)).toEqual(text);
    });

    it("should correctly break on spaces for an excerpt", function() {
        var text = "SECRET TEHRAN 2077 Declassified";
        expect(excerpt(text, 15)).toEqual("SECRET TEHRAN...");
    });

    it("should correctly skip the last space for an excerpt", function() {
        var text = "SECRET TEHRAN";
        expect(excerpt(text, 6)).toEqual("SECRET...");
        expect(excerpt(text, 7)).toEqual("SECRET...");
    });
});
