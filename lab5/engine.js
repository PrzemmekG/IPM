


window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

function init(){

  //Łącze się do IndexDB
  var request = window.indexedDB.open("MyDatabase", 3);

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

function randomString(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
document.getElementById('RandomDataButton').onclick = function(e)
{
  document.getElementById('nameInput').value = randomString(['Bartek','Stefan','Marcin','Jerzy','Piotrek', 'Maciej', 'Janek', 'Paweł','Kasia']);
  document.getElementById('lastNameInput').value = randomString(['Kowalski','Gabrych','Marcinkowski','Stasiak','Kazimierczyk', 'Dobrowolski', 'Marciniak', 'Chałubek','Koza']);
  document.getElementById('adresInput').value = randomString(['Sloneczna 45','Malinowa 0','Zrodlana 10','Pomaranczowa 50','Wroblewskiego 32', 'Brukowa 15', 'Debowa 2']);
  document.getElementById('PeselInput').value = (Math.floor(Math.random() * 99999999999 + 10)).toString();
  document.getElementById('PhoneInput').value = (Math.floor(Math.random() * 999999999 + 10)).toString();
  document.getElementById('MailInput').value = randomString(['asdf@gmail.com','WGWEdf@onet.com','html@gmail.com','Jacek@wp.com','Stefano@outlook.com', 'Franklin@gmail.com']);

};


request.onupgradeneeded = function(event) { 

  var db = event.target.result;
  var objectStore = db.createObjectStore("users", { keyPath: "pesel" });

  objectStore.createIndex("name", "name", {unique:false});

  objectStore.createIndex("lastname", "lastname", {unique:false});

  objectStore.createIndex("adres", "adres", {unique:false});

  objectStore.createIndex("pesel", "pesel", {unique:false});

  objectStore.createIndex("phone", "phone", {unique:false});

  objectStore.createIndex("mail", "mail", {unique:false});

  objectStore.transaction.oncomplete = function(event) {
	
  }
};

document.getElementById('addButton').onclick = function(e) {

  var bname = document.getElementById('nameInput').value;
  var blastname = document.getElementById('lastNameInput').value;
  var badres = document.getElementById('adresInput').value;
  var bpesel = document.getElementById('PeselInput').value;
  var bphone = document.getElementById('PhoneInput').value;
  var bmail = document.getElementById('MailInput').value;
  
  const users_item = {
	name: bname,
	lastname: blastname,
	adres: badres,
	pesel: bpesel,
  phone: bphone,
  mail: bmail
  }

  var transaction = db.transaction(["users"], "readwrite");

  transaction.oncomplete = function(event) {
	console.log("all done with transaction");
  };

  transaction.onerror = function(event){
	console.dir(event);
  };

  var usersObjectStore = transaction.objectStore("users");
  var request = usersObjectStore.add(users_item);

  request.onsuccess = function(event){
	console.log("added item");
  };

  updatetable();

};


function updatetable(){

  
  document.getElementById("ClientTable").innerHTML = "";

  var request = db.transaction("users").objectStore("users").openCursor();

  request.onerror = function(event){
	console.dir(event);
  };

  request.onsuccess = function(event){

	cursor = event.target.result;

	if(cursor) {

    let but = document.createElement("button");
    let td = document.getElementById("ClientTable");
    but.innerText = "Usun";
    but.className = "btn_buy";
    but.id = cursor.key;
    var id = cursor.key;
	  document.getElementById("ClientTable").innerHTML += "<tr><td>" + cursor.value.name + "</td><td>"
		+ cursor.value.lastname + "</td><td>" + cursor.value.adres + "</td><td>" + cursor.value.pesel + "</td><td>" 
    + cursor.value.phone +  "</td><td>" + cursor.value.mail + "</td><td>"
    + "<button type='button' id='id' >Usun</button>"+ "</td><td>" + "<button type='button' >Edytuj</button>";

    //document.getElementById(cursor.key).onclick = "dilejt()";
    //but.onclick = function() { dilejt()};
    //document.getElementById("books-table-body").appendChild(but);
		cursor.continue();
	}
  };
}

}

