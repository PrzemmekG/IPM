var myNotes = new Object();

myNotes.db = null;

myNotes.open = function() {
	var request = window.mozIndexedDB.open("stickynotes", "This database contains our sticky notes");
	
	request.onsuccess = function(e) {
		var version = "1.0";
		myNotes.db = e.target.result;
		var db = myNotes.db;
		console.log("Database version when opened " + db.version);
		// We can only create Object stores in a setVersion transaction;
		if(version!= db.version) {
			var setVersionRequest = db.setVersion(version);
			// onsuccess is the only place we can create Object Stores
			setVersionRequest.onsuccess = function(e) {
				console.log("Successfully changed the version to " + db.version);
				console.log("Now creating the store \"notes\"");
				var store = db.createObjectStore("notes", {keyPath: "timeStamp"});
      		};
    	}
		// Once the database is initialized and opened, display all sticky notes
		myNotes.getAllNotes();
	};
	
	request.onerror = function(e) {
		console.log(e.target.errorCode);
	};
};

myNotes.addNote = function(todoText) {
  var db = myNotes.db;
  var trans = db.transaction(["notes"], IDBTransaction.READ_WRITE);
  var store = trans.objectStore("notes");
  var note = {
    "text": todoText, 
    "timeStamp" : new Date().getTime() 
    };
  var request = store.put(note);
    
  request.onsuccess = function(e) {
    console.log("Note with timestamp " + e.target.result + " has been added!");
	$('#txt_note').val('');
	myNotes.displayNote(note);
  };
  
  request.onerror = function(e) {
    console.log(e.target.errorCode);
  };
};

myNotes.getAllNotes = function() {	
	var db = myNotes.db;
	var trans = db.transaction(["notes"], IDBTransaction.READ_WRITE);
	var store = trans.objectStore("notes");
	
	// Get everything in the store;
	var cursorRequest = store.openCursor();
	var notes = []; //Empty array that will be populated and then processed
	
	cursorRequest.onsuccess = function(e) {
		var cursor = e.target.result;
		if(cursor) {
			// As long as we have objects in the store
			// We keep adding them to the notes array
			notes.push({"timeStamp": cursor.key, "text" : cursor.value.text});
			cursor.continue();
		} else {
			//No more notes? process those notes
			//For each notes, call displayNote()
			var start = new Date().getTime();
			var notesCount = notes.length;
			for (var i = 0; i < notesCount; i++) {
				console.log("Item number " + i + " on " + notesCount);
			    myNotes.displayNote(notes[i]);
			}
			var end = new Date().getTime();
			var total = end - start;
			console.log("Array processed in " + total);
		}
	};
};

myNotes.displayNote = function(note) {
	//Get general div containing notes and add the current note in it
	var notesDiv = $('#notes');
	var singleNote = $('<div class="note"><img class="delete" src="delete.png" alt="delete image"></img><p>'+ note.text +'</p></div>');
	singleNote.find('.delete').click(function() {
		myNotes.deleteNote(note.timeStamp);
		singleNote.fadeOut(function() {
			$(this).remove();
		});
	});
	singleNote.hide();
	notesDiv.append(singleNote);
	singleNote.fadeIn();
};

myNotes.deleteNote = function(timestamp) {
	var db = myNotes.db;
	var trans = db.transaction(["notes"], IDBTransaction.READ_WRITE);
	var store = trans.objectStore("notes");
	
	var deleteRequest = store.delete(timestamp);
	
	deleteRequest.onsuccess = function(e) {
		console.log("Item successfully deleted");
	};
};

$(document).ready(function() {
	myNotes.open();
	$('#btn_add').click(function() {
		var message = $('#txt_note').val();
		if(message !== "") {
			myNotes.addNote(message);
		}
	});
	
	$('#addnote').hide();
	
	$('#menubar').toggle(function(){ 
		$('#addnote').slideDown();
	}, function(){ 
		$('#addnote').slideUp();
	});
});