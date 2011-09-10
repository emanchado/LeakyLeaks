var CablePaginator = function(pool, cpp) { this.init(pool, cpp); };
(function ()
 {
     this.init = function(pool, cablesPerPage) {
         this.cablePool     = pool;
         this.cablesPerPage = cablesPerPage;
     };

     this.numberPages = function() {
         return Math.ceil(this.cablePool.cables.length / this.cablesPerPage);
     };

     this._paginate = function(cableSet, pageNumber) {
         var firstIndex = pageNumber * this.cablesPerPage;
         return cableSet.slice(firstIndex, firstIndex + this.cablesPerPage);
     };

     this.cablesForPage = function(pageNumber) {
         return this._paginate(this.cablePool.cables, pageNumber);
     };

     this.cablesWithWordsForPage = function(words, pageNumber) {
         return this._paginate(this.cablePool.cablesWithWords(words),
                               pageNumber);
     };
}).call(CablePaginator.prototype);
