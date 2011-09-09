var CablePool = function() { this.init(); };
(function ()
 {
     this.init = function() {
         this.cables = [];
     };

     this.addCables = function(cables) {
         var self = this;
         v.each(cables, function(c) {
             self.cables.push(c);
         });
     };

     this.reset = function() {
         this.cables = [];
     };

     this.cablesForOffice = function(office) {
         return v.filter(this.cables, function(c) {
             return c.office === office;
         });
     };

     this._matchWords = function(body, words) {
         return v.every(words, function(w) {
             return body.match(new RegExp("\\b" + w + "\\b", "i"));
         });
     };

     this.cablesWithWords = function(words) {
         var wordArray = typeof(words) === 'string' ? words.split(' ') : words;

         var self = this;
         return v.filter(this.cables, function(c) {
             return self._matchWords(c.body, wordArray);
         });
     };

     this.addCableIntersection = function(cableSets) {
         if (cableSets.length === 0) return [];
         return this.addCables(v.filter(cableSets[0], function(c) {
             for (var i = 1, len = cableSets.length; i < len; i += 1) {
                 if (! v.some(cableSets[i], function(c2) { return c2.identifier === c.identifier })) {
                     return false;
                 }
             }
             return true;
         }));
     };
 }).call(CablePool.prototype);
