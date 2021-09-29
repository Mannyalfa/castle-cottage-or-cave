let db;
const request = indexedDB.open("cccDatabase", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("new_home", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
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
  const transaction = db.transaction(["new_home"], "readwrite");
  const homeObjectStore = transaction.objectStore("new_home");
  const getAll = homeObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/homes", {
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
          const transaction = db.transaction(["new_home"], "readwrite");
          const homeObjectStore = transaction.objectStore("new_home");
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
