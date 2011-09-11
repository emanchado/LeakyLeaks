describe("Utils", function() {
    describe("excerpt", function() {
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


    describe("pageInfo", function() {
        var cablePool;

        beforeEach(function() {
            cablePool = new CablePool();
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

        it("should return empty info for any page when having no cables", function() {
            var p1 = pageInfo([], 1);
            var p2 = pageInfo([], 2);
            var p3 = pageInfo([], 3);
            expect(p1.cables).toEqualCables([]);
            expect(p1.firstCable).toEqual(0);
            expect(p1.lastCable).toEqual(0);
            expect(p1.totalCables).toEqual(0);
            expect(p1.totalPages).toEqual(0);
            expect(p2.cables).toEqualCables([]);
            expect(p2.firstCable).toEqual(0);
            expect(p2.lastCable).toEqual(0);
            expect(p2.totalCables).toEqual(0);
            expect(p2.totalPages).toEqual(0);
            expect(p3.cables).toEqualCables([]);
            expect(p3.firstCable).toEqual(0);
            expect(p3.lastCable).toEqual(0);
            expect(p3.totalCables).toEqual(0);
            expect(p3.totalPages).toEqual(0);
        });

        it("should return the first page of cables for less than cables-per-page cables", function() {
            for (var i = 0; i < 3; i += 1) {
                cablePool.addCables([{identifier: "id" + i}]);
            }
            var p1 = pageInfo(cablePool.cables, 1);
            expect(p1.cables).toEqualCables(
                [{identifier: "id0"},
                 {identifier: "id1"},
                 {identifier: "id2"}]);
            expect(p1.firstCable).toEqual(1);
            expect(p1.lastCable).toEqual(3);
            expect(p1.totalCables).toEqual(3);
            expect(p1.totalPages).toEqual(1);
            var p2 = pageInfo(cablePool.cables, 2);
            expect(p2.cables).toEqualCables([]);
            expect(p2.firstCable).toEqual(0);
            expect(p2.lastCable).toEqual(0);
            expect(p2.totalCables).toEqual(3);
            expect(p2.totalPages).toEqual(1);
        });

        it("should return all cables when they're exactly cables-per-page cables", function() {
            var cables = [];
            for (var i = 0; i < 10; i += 1) {
                cables.push([{identifier: "id" + i}]);
            }
            cablePool.addCables(cables);
            var p1 = pageInfo(cablePool.cables, 1);
            expect(p1.cables).toEqualCables(cables);
            expect(p1.firstCable).toEqual(1);
            expect(p1.lastCable).toEqual(10);
            expect(p1.totalCables).toEqual(10);
            expect(p1.totalPages).toEqual(1);
            var p2 = pageInfo(cablePool.cables, 2);
            expect(p2.cables).toEqualCables([]);
            expect(p2.firstCable).toEqual(0);
            expect(p2.lastCable).toEqual(0);
            expect(p2.totalCables).toEqual(10);
            expect(p2.totalPages).toEqual(1);
        });

        it("should get the second page right when there are more than cables-per-page cables", function() {
            var cables = [];
            for (var i = 0; i < 15; i += 1) {
                cables.push([{identifier: "id" + i}]);
            }
            cablePool.addCables(cables);
            var p1 = pageInfo(cablePool.cables, 1);
            expect(p1.cables).toEqualCables(cables.slice(0, 10));
            expect(p1.firstCable).toEqual(1);
            expect(p1.lastCable).toEqual(10);
            expect(p1.totalCables).toEqual(15);
            expect(p1.totalPages).toEqual(2);
            var p2 = pageInfo(cablePool.cables, 2);
            expect(p2.cables).toEqualCables(cables.slice(10, 15));
            expect(p2.firstCable).toEqual(11);
            expect(p2.lastCable).toEqual(15);
            expect(p2.totalCables).toEqual(15);
            expect(p2.totalPages).toEqual(2);
            var p3 = pageInfo(cablePool.cables, 3);
            expect(p3.cables).toEqualCables([]);
            expect(p3.firstCable).toEqual(0);
            expect(p3.lastCable).toEqual(0);
            expect(p3.totalCables).toEqual(15);
            expect(p3.totalPages).toEqual(2);
        });

        it("should always return empty info for page 0", function() {
            var cables = [];
            var case1 = pageInfo(cables, 0);
            expect(case1.cables).toEqualCables([]);
            expect(case1.firstCable).toEqual(0);
            expect(case1.lastCable).toEqual(0);
            expect(case1.totalCables).toEqual(0);
            expect(case1.totalPages).toEqual(0);
            for (var i = 0; i < 10; i += 1) {
                cables.push([{identifier: "id" + i}]);
            }
            var case2 = pageInfo(cables, 0);
            expect(case2.cables).toEqualCables([]);
            expect(case2.firstCable).toEqual(0);
            expect(case2.lastCable).toEqual(0);
            expect(case2.totalCables).toEqual(10);
            expect(case2.totalPages).toEqual(1);
            for (var i = 0; i < 10; i += 1) {
                cables.push([{identifier: "id" + i}]);
            }
            var case2 = pageInfo(cables, 0);
            expect(case2.cables).toEqualCables([]);
            expect(case2.firstCable).toEqual(0);
            expect(case2.lastCable).toEqual(0);
            expect(case2.totalCables).toEqual(20);
            expect(case2.totalPages).toEqual(2);
        });
    });
});
