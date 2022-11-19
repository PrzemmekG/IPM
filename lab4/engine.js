window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

function init(){

var request = window.indexedDB.open("UsersDatabase", 3);

request.onerror = function(event) {
  alert("Error faced while opening database");
};
request.onsuccess = function(event) {

  db = event.target.result;
  

  db.onerror = function(event) {

	alert("Database error: " + event.target.errorCode);
  };

};
request.onupgradeneeded = function(event) { 

  var db = event.target.result;
  var objectStore = db.createObjectStore("users", { keyPath: "pesel" });

  objectStore.createIndex("name", "name", {unique:false});

  objectStore.createIndex("lastname", "lastname", {unique:false});

  objectStore.createIndex("adres", "adres", {unique:false});

  objectStore.transaction.oncomplete = function(event) {
	
  }
};

document.getElementById('addButton').onclick = function(e) {

  var bname = document.getElementById('nameInput').value;
  var bauthor = document.getElementById('lastNameInput').value;
  var byear = document.getElementById('adresInput').value;
  var bisbn = document.getElementById('PeselInput').value;
  
  const book_item = {
	name: bname,
	author: bauthor,
	year: byear,
	isbn: bisbn
  }

  var transaction = db.transaction(["users"], "readwrite");

  transaction.oncomplete = function(event) {
	console.log("all done");
  };

  transaction.onerror = function(event){
	console.dir(event);
  };

  var booksObjectStore = transaction.objectStore("users");
  var request = booksObjectStore.add(book_item);

  request.onsuccess = function(event){
	console.log("added item");
  };

  updatetable();

};

document.getElementById('delButton').onclick = function(e){

  var isbn_del = document.getElementById('isPeselInput').value;

  var request = db.transaction(["users"], "readwrite").objectStore("users").delete(isbn_del);

  request.onsuccess = function(event){
	console.log(isbn_del+" usunięty");
  };

  updatetable();
};

function updatetable(){

  document.getElementById("books-table-body").innerHTML = "";

  var request = db.transaction("users").objectStore("users").openCursor();

  request.onerror = function(event){
	console.dir(event);
  };

  request.onsuccess = function(event){

	cursor = event.target.result;

	if(cursor) {
	  document.getElementById("books-table-body").innerHTML += "<tr><td>" + cursor.value.name + "</td><td>"
		+ cursor.value.author + "</td><td>" + cursor.value.year + "</td><td>" + cursor.key + "</td></tr>";

		cursor.continue();
	}
  };
}
}