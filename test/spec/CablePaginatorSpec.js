describe("CablePaginator", function() {
    var cablePaginator, cablePool;

    beforeEach(function() {
        cablePool = new CablePool();
        cablePaginator = new CablePaginator(cablePool, 10);
        this.addMatchers({
            toEqualCables: function(expected) {
                var actualIds = v.map(this.actual,
                                      function(c) { return c.identifier });
                var expectedIds = v.map(expected,
                                        function(c) { return c.identifier });
                return this.env.equals_(actualIds, expectedIds);
            }
        });
    });

    it("should be able to create an empty paginator", function() {
        expect(cablePaginator).toBeDefined();
    });

    it("should return 0 pages for no cables", function() {
        expect(cablePaginator.numberPages()).toEqual(0);
    });

    it("should return no cables for any page when having no cables", function() {
        expect(cablePaginator.cablesForPage(0)).toEqualCables([]);
        expect(cablePaginator.cablesForPage(1)).toEqualCables([]);
        expect(cablePaginator.cablesForPage(2)).toEqualCables([]);
    });

    it("should return 1 page for <= cables-per-page cables", function() {
        for (var i = 0; i < 9; i += 1) {
            cablePool.addCables([{identifier: "foobar"}]);
        }
        expect(cablePaginator.numberPages()).toEqual(1);
        cablePool.addCables([{identifier: "foobar"}]);
        expect(cablePaginator.numberPages()).toEqual(1);
    });

    it("should return 2 pages for more than cables-per-page cables", function() {
        for (var i = 0; i < 11; i += 1) {
            cablePool.addCables([{identifier: "foobar"}]);
        }
        expect(cablePaginator.numberPages()).toEqual(2);
    });

    it("should return the first page of cables for less than cables-per-page cables", function() {
        for (var i = 0; i < 3; i += 1) {
            cablePool.addCables([{identifier: "id" + i}]);
        }
        expect(cablePaginator.cablesForPage(0)).toEqualCables(
            [{identifier: "id0"},
             {identifier: "id1"},
             {identifier: "id2"}]);
        expect(cablePaginator.cablesForPage(1)).toEqualCables([]);
    });

    it("should return all cables when they're exactly cables-per-page cables", function() {
        var cables = [];
        for (var i = 0; i < 10; i += 1) {
            cables.push([{identifier: "id" + i}]);
        }
        cablePool.addCables(cables);
        expect(cablePaginator.cablesForPage(0)).toEqualCables(cables);
        expect(cablePaginator.cablesForPage(1)).toEqualCables([]);
    });

    it("should get the second page right when there are more than cables-per-page cables", function() {
        var cables = [];
        for (var i = 0; i < 15; i += 1) {
            cables.push([{identifier: "id" + i}]);
        }
        cablePool.addCables(cables);
        expect(cablePaginator.cablesForPage(1)).toEqualCables(cables.slice(10,
                                                                           15));
        expect(cablePaginator.cablesForPage(2)).toEqualCables([]);
    });

    it("should find all cables when filtering with no words", function() {
        var cables = [];
        for (var i = 0; i < 5; i += 1) {
            cables.push({identifier: "id" + i,
                         body: "body" + i});
        }
        cablePool.addCables(cables);
        expect(cablePaginator.cablesWithWordsForPage("", 0)).
            toEqualCables(cables);
        expect(cablePaginator.cablesWithWordsForPage("", 1)).
            toEqualCables([]);
    });

    it("should not find any cables when filtering with non-existent words", function() {
        var cables = [];
        for (var i = 0; i < 15; i += 1) {
            cables.push({identifier: "id" + i,
                         body: "body" + i});
        }
        cablePool.addCables(cables);
        expect(cablePaginator.cablesWithWordsForPage("foo", 0)).
            toEqualCables([]);
        expect(cablePaginator.cablesWithWordsForPage("foo", 1)).
            toEqualCables([]);
    });

    it("should find all cables when filtering with common words", function() {
        var cables = [];
        for (var i = 0; i < 5; i += 1) {
            cables.push({identifier: "id" + i,
                         body: "body commonword " + i});
        }
        cablePool.addCables(cables);
        expect(cablePaginator.cablesWithWordsForPage("commonword", 0)).
            toEqualCables(cables);
        expect(cablePaginator.cablesWithWordsForPage("commonword", 1)).
            toEqualCables([]);
    });
});
