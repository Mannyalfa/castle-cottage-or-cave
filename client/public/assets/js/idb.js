// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'home_hunt' and set it to version 1
const request = indexedDB.open("cccDatabase", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  db.createObjectStore("new_home", { autoIncrement: true });
};

request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadHome() function to send all local db data to api
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    uploadHome();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["new_home"], "readwrite");

  const homeObjectStore = transaction.objectStore("new_home");

  homeObjectStore.add(record);
}

function uploadHome() {
  // open a transaction on your db
  const transaction = db.transaction(["new_home"], "readwrite");

  // access your object store
  const homeObjectStore = transaction.objectStore("new_home");

  // get all records from store and set to a variable
  const getAll = homeObjectStore.getAll();

  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_home"], "readwrite");
          // access the new_home object store
          const homeObjectStore = transaction.objectStore("new_home");
          // clear all items in your store
          homeObjectStore.clear();

          alert("All saved home has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadHome);
