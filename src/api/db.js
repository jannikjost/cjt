const dbName = "cjt";
const objectStoreName = "cjtovertime";

let db;

export { createDataBase, addEntry, getData };

function createDataBase() {
  if (!window.indexedDB) {
    console.log("Your Browser doesn't support a stable version of IndexedDB.");
  }

  let request = window.indexedDB.open(dbName);

  request.onerror = function() {
    console.log("Why didn't you allow my web app to use IndexedDB?!");
  };
  request.onsuccess = function(event) {
    db = event.target.result;

    db.onerror = function(event) {
      // Generic error handler for all errors targeted at this database's
      // requests!
      console.error("Database error: " + event.target.errorCode);
    };
  };

  request.onupgradeneeded = function(event) {
    // Save the IDBDatabase interface
    db = event.target.result;

    // Create an objectStore for this database
    var objectStore = db.createObjectStore(objectStoreName, {
      keyPath: "date",
    });
    objectStore.createIndex("date", "date", { unique: true });
    objectStore.createIndex("overtime", "overtime", { unique: false });
    objectStore.transaction.oncomplete = function() {
      console.log(objectStoreName + " successfully created");
    };
  };
}

function addEntry(data) {
  const transaction = createTransaction("readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  var request = objectStore.add(data);
  request.onerror = function(event) {
    console.log("Request error: " + event.target.errorCode);
  };
  request.onsuccess = function() {
    console.log("Request success");
  };
}

function getData() {
  return new Promise(function(resolve, reject) {
    const transaction = createTransaction();
    const objectStore = transaction.objectStore(objectStoreName);
    var request = objectStore.getAll();
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    request.onerror = function(event) {
      reject(event.target.errorCode);
    };
  });
}

function createTransaction(mode) {
  var transaction = db.transaction([objectStoreName], mode);
  transaction.oncomplete = function() {
    console.log("Transaction done!");
  };
  transaction.onerror = function(event) {
    console.error("Transaction error: " + event.target.errorCode);
  };

  return transaction;
}
