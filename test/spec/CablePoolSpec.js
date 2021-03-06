describe("CablePool", function() {
    var cablePool;
    
    beforeEach(function() {
        cablePool = new CablePool;
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

    it("should be able to create an empty pool", function() {
        expect(cablePool).toBeDefined();
    });

    it("should have 0 cables initially", function() {
        expect(cablePool.cables).toEqualCables([]);
    });

    it("should have some cables after adding them", function() {
        var cable = {"score":"100",
                     "identifier":"08BOGOTA3888",
                     "classification":"CONFIDENTIAL",
                     "office":"Embassy Bogota",
                     "date_sent":"2008-10-24 19:48:00",
                     "released":"2011-03-13 12:30:00",
                     "subject":"DAS DIRECTOR RESIGNS OVER ..."};
        cablePool.addCables([cable]);
        expect(cablePool.cables).toEqualCables([cable]);
    });

    it("should have both sets of cables after adding twice", function() {
        var cable1 = {"score":"100",
                      "identifier":"08BOGOTA3888",
                      "classification":"CONFIDENTIAL",
                      "office":"Embassy Bogota",
                      "date_sent":"2008-10-24 19:48:00",
                      "released":"2011-03-13 12:30:00",
                      "subject":"DAS DIRECTOR RESIGNS OVER ..."};
        var cable2 = {"score":"46",
                      "identifier":"09TRIPOLI365",
                      "classification":"UNCLASSIFIED",
                      "office":"Embassy Tripoli",
                      "date_sent":"2009-05-04 14:02:00",
                      "released":"2011-01-31 21:30:00",
                      "subject":"DAS DOMESTIC SPYING SCANDAL DEEPENS"};
        cablePool.addCables([cable1]);
        cablePool.addCables([cable2]);
        expect(cablePool.cables).toEqualCables([cable1, cable2]);
    });

    it("should not have cables after resetting", function() {
        var cable = {"score":"100",
                     "identifier":"08BOGOTA3888",
                     "classification":"CONFIDENTIAL",
                     "office":"Embassy Bogota",
                     "date_sent":"2008-10-24 19:48:00",
                     "released":"2011-03-13 12:30:00",
                     "subject":"DAS DIRECTOR RESIGNS OVER ..."};
        cablePool.addCables([cable]);
        cablePool.reset();
        expect(cablePool.cables).toEqualCables([]);
    });

    it("should filter out cables not for the given office", function() {
        var cable = {"score":"100",
                     "identifier":"08BOGOTA3888",
                     "classification":"CONFIDENTIAL",
                     "office":"Embassy Bogota",
                     "date_sent":"2008-10-24 19:48:00",
                     "released":"2011-03-13 12:30:00",
                     "subject":"DAS DIRECTOR RESIGNS OVER ..."};
        cablePool.addCables([cable]);
        expect(cablePool.cablesForOffice("Another Embassy")).toEqualCables([]);
    });

    it("should find cables for the given office", function() {
        var cable = {"score":"100",
                     "identifier":"08BOGOTA3888",
                     "classification":"CONFIDENTIAL",
                     "office":"Embassy Bogota",
                     "date_sent":"2008-10-24 19:48:00",
                     "released":"2011-03-13 12:30:00",
                     "subject":"DAS DIRECTOR RESIGNS OVER ..."};
        cablePool.addCables([cable]);
        var filtered = cablePool.cablesForOffice("Embassy Bogota");
        expect(filtered).toEqualCables([cable]);
    });

    it("should return all cables when filtering with zero words", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords([])).toEqualCables([cable]);
    });

    it("should filter out cables without the given word", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords(["fnord"])).toEqualCables([]);
    });

    it("should find cables with the given word", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords(["TEHRAN"])).toEqualCables([cable]);
    });

    it("should find cables with the given word regardless of case", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords(["tehran"])).toEqualCables([cable]);
    });

    it("should filter out cables containing only one of the words", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords(["TEHRAN",
                                          "fnord"])).toEqualCables([]);
    });

    it("should find cables containing several words", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords(["TEHRAN",
                                          "Declassified"])).toEqualCables([cable]);
    });


    it("should treat a string as a space-separated list of words", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords("TEHRAN Declassified")).toEqualCables([cable]);
    });

    it("should find all cables when filtering by an empty string", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords("")).toEqualCables([cable]);
    });

    it("should not match cables with half-words", function() {
        var cable = {"identifier":"73TEHRAN2077",
                     "date_sent":"1973-04-02 08:34:00",
                     "released":"2011-01-18 21:00:00",
                     "subject":"AUDIENCE WITH SHAH APRIL 5",
                     "header":"P 020834Z APR 73\nFM AMEMBASSY TEHRAN...",
                     "body":"S E C R E T TEHRAN 2077 \n \nDeclassified...",
                     "office":"Embassy Tehran",
                     "classification":"SECRET"};
        cablePool.addCables([cable]);
        expect(cablePool.cablesWithWords(["TEH"])).toEqualCables([]);
    });

    it("should calculate intersection of zero cable sets", function() {
        cablePool.addCableIntersection([])
        expect(cablePool.cables).toEqualCables([]);
    });

    it("should calculate intersection of one cable set", function() {
        var cableSet = [{"identifier":"73TEHRAN2077",
                         "classification":"SECRET"},
                        {"identifier":"73TEHRAN2078",
                         "classification":"SECRET"}];
        cablePool.addCableIntersection([cableSet])
        expect(cablePool.cables).toEqualCables(cableSet);
    });

    it("should calculate intersection of two equal cable sets", function() {
        var cableSet1 = [{"identifier":"73TEHRAN2077",
                          "classification":"SECRET"},
                         {"identifier":"73TEHRAN2078",
                          "classification":"SECRET"}];
        var cableSet2 = [{"identifier":"73TEHRAN2077",
                          "classification":"SECRET"},
                         {"identifier":"73TEHRAN2078",
                          "classification":"SECRET"}];
        cablePool.addCableIntersection([cableSet1, cableSet2])
        expect(cablePool.cables).toEqualCables(cableSet1);
    });

    it("should calculate intersection of two completely different sets", function() {
        var cableSet1 = [{"identifier":"73TEHRAN2077",
                          "classification":"SECRET"},
                         {"identifier":"73TEHRAN2078",
                          "classification":"SECRET"}];
        var cableSet2 = [{"identifier":"73TEHRAN2079",
                          "classification":"SECRET"},
                         {"identifier":"73TEHRAN2080",
                          "classification":"SECRET"}];
        cablePool.addCableIntersection([cableSet1, cableSet2]);
        expect(cablePool.cables).toEqualCables([]);
    });

    it("should calculate intersection of two slightly different sets", function() {
        var commonCable = {"identifier":"73TEHRAN2078",
                           "classification":"SECRET"};
        var cableSet1 = [{"identifier":"73TEHRAN2077",
                          "classification":"SECRET"},
                         commonCable];
        var cableSet2 = [commonCable,
                         {"identifier":"73TEHRAN2080",
                          "classification":"SECRET"}];
        cablePool.addCableIntersection([cableSet1, cableSet2]);
        expect(cablePool.cables).toEqualCables([commonCable]);
    });

    it("should calculate intersection of the same sets, different order", function() {
        var cable1 = {"identifier":"73TEHRAN2077",
                      "classification":"SECRET"};
        var cable2 = {"identifier":"73TEHRAN2078",
                      "classification":"SECRET"};
        cablePool.addCableIntersection([[cable1, cable2], [cable2, cable1]]);
        expect(cablePool.cables).toEqualCables([cable1, cable2]);
    });

    it("should barf when addCables receives invalid options", function() {
        expect(function() {
            cablePool.addCables([], {sort: "date_sent", invalidOption: "foo"});
        }).toThrow(new Error("Invalid option 'invalidOption'"));
    });

    it("should order cables given to addCables with the appropriate option", function() {
        var cable1 = {"identifier":"73TEHRAN2077",
                      "date_sent":"1972-02-25 09:30:00"};
        var cable2 = {"identifier":"73TEHRAN2078",
                      "date_sent":"1979-08-13 04:58:00"};
        cablePool.addCables([cable1, cable2], {sort: "date_sent"});
        expect(cablePool.cables).toEqualCables([cable2, cable1]);
    });

    it("should order cables given to addCableIntersection with the appropriate option", function() {
        var cable1 = {"identifier":"73TEHRAN2077",
                      "date_sent":"1972-02-25 09:30:00"};
        var cable2 = {"identifier":"73TEHRAN2078",
                      "date_sent":"1979-08-13 04:58:00"};
        var cable3 = {"identifier":"75TEHRAN2069",
                      "date_sent":"2010-11-30 16:30:00"};
        var cable4 = {"identifier":"75TEHRAN2070",
                      "date_sent":"2010-11-30 16:30:00"};
        cablePool.addCableIntersection([[cable1, cable3, cable2],
                                        [cable2, cable1, cable3, cable4]],
                                       {sort: "date_sent"});
        expect(cablePool.cables).toEqualCables([cable3, cable2, cable1]);
    });
});
