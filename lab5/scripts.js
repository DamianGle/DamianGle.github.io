//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Brak wsparcia IndexedDB na twoja przegladarke.")
};

const employeeData = [{id:"01", name:"Jan", surname:"Kowalski", age:"20", nd:"CAY123456", postal:"22-550", email:"example@wp.pl", www:"https://krzak.pl", date:"Thu Apr 29 2021"}];

var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: ", db);
    loadTable();
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", {
        keyPath: "id"
    });
    for (var i in employeeData) {
        objectStore.add(employeeData[i]);
    }
}

function loadTable() {
    var employees = "";
    $('.employee').remove();

    var objectStore = db.transaction("employee").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
    if (cursor) {
            employees = employees.concat(
                '<tr class="employee">' +
                '<td class="ID">' + cursor.key + '</td>' +
                '<td class="Imie">' + cursor.value.name + '</td>' +
                '<td class="Nazwisko">' + cursor.value.surname + '</td>' +
                '<td class="Wiek">' + cursor.value.age + '</td>' +
                '<td class="numer_dowodu">' + cursor.value.nd + '</td>' +
                '<td class="kod_pocztowy">' + cursor.value.postal + '</td>' +
                '<td class="Email">' + cursor.value.email + '</td>' +
                '<td class="WWW">' + cursor.value.www + '</td>' +
                '<td class="Data">' + cursor.value.date + '</td>' +
                '<td><button style="background-color:red;" onClick="deleteEmployee(\'' + cursor.key + '\')">X</button>' +
                '</tr>');
                
                } else {
            $('thead').after(employees); // no more events
                       }
        cursor.continue();
                                                            };
                    }

function addEmployee() {
    var employeeID = $('#add_id').val();
    var name = $('#add_name').val();
    var surname = $('#add_surname').val();
    var age = $('#add_age').val();
    var nd = $('#add_nd').val();
    var postal = $('#add_postal').val();
    var email = $('#add_email').val();
    var www = $('#add_www').val();
    var date = $('#add_date').val();
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: employeeID,
            name: name,
            surname: surname,
            age: age,
            nd: nd,
            postal: postal,
            email: email,
            www: www,
            date: date
        });


    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };

    request.onerror = function (event) {
        var request = db.transaction(["employee"], "readwrite").objectStore("employee").delete(employeeID)
        var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: employeeID,
            name: name,
            surname: surname,
            age: age,
            nd: nd,
            postal: postal,
            email: email,
            www: www,
            date: date
        });
        loadTable();
        clearButtons();
    }
}

function deleteEmployee(x) {
    var employeeID = x;
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete(employeeID);

    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };
};

function clearButtons() {
    $('#add_id').val("");
    $('#add_name').val("");
    $('#add_surname').val("");
    $('#add_age').val("");
    $('#add_nd').val("");
    $('#add_postal').val("");
    $('#add_email').val("");
    $('#add_www').val("");
    $("#add_date").val("");
};

function searchtable() {
    var employees = "";
    $('.employee').remove();
    var objectStore = db.transaction("employee").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
        if (cursor) {
            if((cursor.value.id.toString() +
                cursor.value.name.toLowerCase() +
                cursor.value.surname.toLowerCase() +
                cursor.value.age.toString() + 
                cursor.value.nd.toLowerCase() + 
                cursor.value.postal.toString() +
                cursor.value.email.toLowerCase() +
                cursor.value.www.toLowerCase() +
                cursor.value.date.toLowerCase()).includes($('#search').val().toLowerCase().replace(/ /g,''))){
                employees = employees.concat(
                    '<tr class="employee">' +
                    '<td class="ID">' + cursor.key + '</td>' +
                    '<td class="Imie">' + cursor.value.name + '</td>' +
                    '<td class="Nazwisko">' + cursor.value.surname + '</td>' +
                    '<td class="Wiek">' + cursor.value.age + '</td>' +
                    '<td class="numer_dowodu">' + cursor.value.nd + '</td>' +
                    '<td class="kod_pocztowy">' + cursor.value.postal + '</td>' +
                    '<td class="Email">' + cursor.value.email + '</td>' +
                    '<td class="WWW">' + cursor.value.www + '</td>' +
                    '<td class="Data">' + cursor.value.date + '</td>' +
                    '<td><button style="background-color:red;" onClick="deleteEmployee(\'' + cursor.key + '\')">X</button>' +
                    '</tr>');
                                                    } 
                    }
         else{
            $('thead').after(employees); // no more events
             } 
                cursor.continue();       
                                                            };
                    }

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
                                }

function randomText(textArray) {
    var randomIndex = Math.floor(Math.random() * textArray.length); 
    var randomElement = textArray[randomIndex];
    return randomElement;
                                }

function getRandomString(length) {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

function generateData(){
    document.getElementById("add_id").value = Math.floor(Math.random() * 101).toString();
    document.getElementById("add_name").value = randomText(["Jan","Tomasz","Maciej","Marcin","Andrzej","Adam","Robert","Jakub","Kamil","Dominik"]);
    document.getElementById("add_surname").value = randomText(["Ryba","Lok","Papa","Corleone","Stalone","Torino","Polanski","Psikut","Nowak","Kowalski"]);
    document.getElementById("add_age").value = Math.floor((Math.random() * 89)+10).toString();
    document.getElementById("add_nd").value = 'CAY' + Math.floor((Math.random() * 899999) + 100000).toString();
    document.getElementById("add_postal").value = Math.floor((Math.random() * 89) + 10).toString() + '-' + Math.floor((Math.random() * 899) + 100).toString();
    document.getElementById("add_email").value = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5) + '@gmail.com';         
    document.getElementById("add_www").value = 'https://' + getRandomString(Math.floor((Math.random() * 12) + 5)) + '.com';
    document.getElementById("add_date").value = randomDate(new Date(2021, 4, 4), new Date()).toString().substring(0, 16);     
                        }

function refresh(){
loadTable();
                  }
