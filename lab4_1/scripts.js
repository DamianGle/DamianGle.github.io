//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Brak wsparcia IndexedDB na twoja przegladarke.")
};

const employeeData = [{id:"01", name:"Jan", surname:"Kowalski", age:"20", email:"example@wp.pl", postal:"22-550"}];

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
                '<td class="Email">' + cursor.value.email + '</td>' +
                '<td class="kod_pocztowy">' + cursor.value.postal + '</td>' +
                '</tr>');
            cursor.continue(); // wait for next event
        } else {
            $('thead').after(employees); // no more events
        }
    };
}

function addEmployee() {
    var employeeID = $('#add_id').val();
    var name = $('#add_name').val();
    var surname = $('#add_surname').val();
    var age = $('#add_age').val();
    var email = $('#add_email').val();
    var postal = $('#add_postal').val();
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: employeeID,
            name: name,
            surname: surname,
            age: age,
            email: email,
            postal: postal
        });


    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };

    request.onerror = function (event) {
        alert("error");
    }
}

function generateEmployee() {
    var email = $('#add_email').val();
    
    const names = ["Jan", "Piotr", "Andrzej", "Lukasz", "Maciej"];
    var random_val = Math.floor(Math.random() * 4);
    const surnames = ["Kowalski", "Nowak", "Moscicki", "Fryderyk"];
    var random_val_2 = Math.floor(Math.random() * 4);
    var age = Math.floor(Math.random() * 75) + 18;
    var employeeID = String(Math.floor(Math.random() * 99));
    var name = names[random_val];
    var surname = surnames[random_val_2]
    var postal_1 = Math.floor(Math.random() * 99);
    var postal_2 = Math.floor(Math.random() * 898) + 100;
    var postal = String(postal_1) + '-' + String(postal_2)
    
    const email_domain = ["@wp.pl", "@gmail.com", "@o2.pl", "@op.pl"];
    var email_domain_val = Math.floor(Math.random() * 4);
    var email = name + '.' + surname + email_domain[email_domain_val];
    
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: employeeID,
            name: name,
            surname: surname,
            age: age,
            email: email,
            postal: postal
        });


    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };

    request.onerror = function (event) {
        alert("error");
    }
}

function deleteEmployee() {
    var employeeID = $('#delete_id').val();
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
    $('#add_email').val("");
    $('#add_postal').val("");
    $('delete_id').val("");
};
