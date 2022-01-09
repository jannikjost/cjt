const dbName = "cjt";
const objectStoreName = "overtime";

let db;
//TODO data in store, or send event when data changes?
//TODO data sorting, newest should be on top
export { createDataBase, addEntry, getData, getWorkday, updateWorkday };

function createDataBase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.error(
        "Your Browser doesn't support a stable version of IndexedDB."
      );
    }

    let request = window.indexedDB.open(dbName);

    request.onerror = function() {
      reject();
      console.error("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function(event) {
      db = event.target.result;
      resolve();
      db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's
        // requests!

        console.debug("Database error: " + event.target.error.message);
      };
    };

    request.onupgradeneeded = function(event) {
      // Save the IDBDatabase interface
      db = event.target.result;

      // Create an objectStore for this database
      var objectStore = db.createObjectStore(objectStoreName, {
        keyPath: "date",
      });
      //TODO add new entry, minutes(overtime that day)
      objectStore.createIndex("date", "date", { unique: true });
      objectStore.createIndex("overtime", "overtime", { unique: false });
      objectStore.transaction.oncomplete = function() {
        console.debug(objectStoreName + " successfully created");
      };

      var objectStore2 = db.createObjectStore("workday", {
        keyPath: "id",
      });
      objectStore2.createIndex("id", "id", { unique: true });
      objectStore2.createIndex("workday", "workday", { unique: false });
      objectStore2.transaction.oncomplete = function() {
        console.debug("workday" + " successfully created");
      };
    };
  });
}

function addEntry(data) {
  return new Promise((resolve, reject) => {
    const transaction = createTransaction("readwrite");
    const objectStore = transaction.objectStore(objectStoreName);
    var request = objectStore.add(data);
    request.onerror = function(event) {
      console.debug("Request error: " + event.target.error.message);
      reject("Request error: " + event.target.error.message);
    };
    request.onsuccess = function() {
      console.debug("Request success");
      resolve();
    };
  });
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
  var transaction = db.transaction([objectStoreName, "workday"], mode);
  transaction.oncomplete = function() {
    console.debug("Transaction done!");
  };
  transaction.onerror = function(event) {
    console.debug("Transaction error: " + event.target.error.message);
  };

  return transaction;
}

function updateWorkday(newWorkday) {
  return new Promise(function(resolve, reject) {
    const transaction = createTransaction("readwrite");
    const objectStore = transaction.objectStore("workday");
    var request = objectStore.put({
      id: 0,
      workday: JSON.stringify(newWorkday),
    });
    request.onerror = function(event) {
      console.debug("Request error: " + event.target.error.message);
      reject("Request error: " + event.target.error.message);
    };
    request.onsuccess = function() {
      console.debug("Success: Updating workday");
      resolve();
    };
  });
}

function getWorkday() {
  return new Promise(function(resolve, reject) {
    const transaction = createTransaction();
    const objectStore = transaction.objectStore("workday");
    var request = objectStore.getAll();
    request.onsuccess = function(event) {
      //only one workday entry exists
      resolve(event.target.result[0]);
    };
    request.onerror = function(event) {
      reject(event.target.errorCode);
    };
  });
}
