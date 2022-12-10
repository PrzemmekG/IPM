window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

function randomString(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}





function init(){

  
  document.getElementById('RandomDataButton').onclick = function(e)
  {
    document.getElementById('nameInput').value = randomString(['Bartek','Stefan','Marcin','Jerzy','Piotrek', 'Maciej', 'Janek', 'Paweł','Kasia']);
    document.getElementById('lastNameInput').value = randomString(['Kowalski','Gabrych','Marcinkowski','Stasiak','Kazimierczyk', 'Dobrowolski', 'Marciniak', 'Chałubek','Koza']);
    document.getElementById('adresInput').value = randomString(['Sloneczna 45','Malinowa 0','Zrodlana 10','Pomaranczowa 50','Wroblewskiego 32', 'Brukowa 15', 'Debowa 2']);
    document.getElementById('PeselInput').value = (Math.floor(Math.random() * 99999999999 + 10)).toString();
  
  };


var request = window.indexedDB.open("MyTestDatabase", 3);

request.onerror = function(event) {
  alert("Error faced while opening database");
};
request.onsuccess = function(event) {

  db = event.target.result;
  

  db.onerror = function(event) {

	alert("Database error: " + event.target.errorCode);
  alert("Sprawdź czy nie ma już klienta o podanym peselu!");
  };

};
request.onupgradeneeded = function(event) { 

  var db = event.target.result;
  var objectStore = db.createObjectStore("books", { keyPath: "isbn" });

  objectStore.createIndex("name", "name", {unique:false});

  objectStore.createIndex("author", "author", {unique:false});

  objectStore.createIndex("year", "year", {unique:false});

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

  
  var transaction = db.transaction(["books"], "readwrite");

  transaction.oncomplete = function(event) {
	console.log("all done with transaction");
  };

  transaction.onerror = function(event){
	console.dir(event);
  };

  var booksObjectStore = transaction.objectStore("books");
  var request = booksObjectStore.add(book_item);

  request.onsuccess = function(event){
	console.log("added item");
  };

  updatetable();

};

document.getElementById('delButton').onclick = function(e){

  var isbn_del = document.getElementById('isPeselInput').value;

  var request = db.transaction(["books"], "readwrite").objectStore("books").delete(isbn_del);

  request.onsuccess = function(event){
	console.log(isbn_del+" deleted");
  };

  updatetable();
};

function updatetable(){

  document.getElementById("books-table-body").innerHTML = "";

  var request = db.transaction("books").objectStore("books").openCursor();

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