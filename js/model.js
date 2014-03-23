/** 
 * @file js/model.js This is the "model" of the model, view, controller system.
 * @author Matthew Shrider <mattshrider@gmail.com>
 */

/** 
* Model namespace for encapsulating the model data of the simulation.
* @namespace model
*/
var model = {
   /** How large the pages are in bytes */
   pagesize: 512,
   /** The list of processes in the model */
   procs: [],
   /** An object representing physical memory */
   memory: {
      size: 4*1024,
      frames: []
   },
   /**
    * @method addProc
    * Adds a process to the Process list
    * @param {int} id The id of the process.
    * @param {int} text The amount of bytes in the text segment.
    * @param {int} data The amount of bytes in the data segment.
    * @memberof model
    */
   addProc: function(id, text, data){
      this.procs[this.procs.length] = new this.Proc(id, text, data);
   },
   /**
    * @method removeProc
    * Removes a process from the process list
    * @param {int} id Which process id should be removed from the list.
    * @memberof model
    */
   removeProc: function(id){
      for (var i=0; i < this.procs.length; ++i){
         if(this.procs[i].equals(id)){
            this.procs.splice(i,1);
         }
      }
   }
};

/** 
 * Represents a process in the simulation.
 * @constructor
 * @param {int} id The process id.
 * @param {int} text The size of the process text in bytes.
 * @param {int} data The size of the process data in bytes.
 */
model.Proc = function(id, text, data){
   /** The id of the process. */
   this.id = id;
   /** How many bytes of text are in the process. */
   var textsize = text;
   /** How many bytes of data are in the process. */
   var datasize = data;
   /** The total amount of bytes for the process. */
   var pagesize = model.pagesize;
   /** The amount of data pages in the process. */
   var datapages = Math.ceil(datasize/pagesize);
   /** The amount of text pages in the process. */
   var textpages = Math.ceil(textsize/pagesize);
   /** Array which represents the page table of the proc. */
   var pageTable = [];

   /* Creates the text pages for the process */
   for(var i=0, counter = textsize; counter > 0; i++){
      if (counter > pagesize){
         pageTable[i] = new this.Page('text', pagesize);
      } else {
         pageTable[i] = new this.Page('text', counter);
      }
      counter -= pagesize;
   }

   /* Creates the data pages for the process */
   for(i=pageTable.length, counter = datasize; counter > 0; i++){
      if (counter > pagesize){
         pageTable[i] = new this.Page('data', pagesize);
      } else {
         pageTable[i] = new this.Page('data', counter);
      }
      counter -= pagesize;
   }
};

/**
 * @method equals
 * A process is equal to another one if the id matches.
 * @memberof model.Proc#
 */
model.Proc.prototype.equals = function(id){
   return this.id === id;
};

/**
 * Represents a page in logical memory.
 * @constructor
 * @param {String} type Either 'text' or 'data' page.
 * @param {int} size The size of the page, upto {@link model.pagesize}.
 */
model.Page = function(type, size){
   this.type = type;
   this.size = size;
};

/**
 * Represents a frame in physical memory.
 * @constructor
 * @param {int} pid The id of the process which "owns" the frame.
 * @param {String} type Either 'text' or 'data' frame.
 * @param {int} page Which page in logical memory the frame represents.
 */
model.Frame = function(pid, type, page){
   this.pid = pid;
   this.type = type;
   this.page = page;
};
