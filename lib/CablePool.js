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
         var self = this;
         return v.filter(this.cables, function(c) {
             return self._matchWords(c.body, words);
         });
     };
 }).call(CablePool.prototype);
