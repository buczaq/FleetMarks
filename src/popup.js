function saveLinkToStorage(title, link) {

    chrome.storage.local.get(["FleetMarks_LinksData"], function(result) {
        console.log('Value got from storage is: ' + result.FleetMarks_LinksData);
        var rawData = result.FleetMarks_LinksData

        dataInJson = {}
        if (rawData) {
            try {
                dataInJson = JSON.parse(rawData);
            } catch (ex) {
                console.log('There was a problem with data parsing!');
            }
        }

        dataInJson[link] = title;
        var dataToSet = JSON.stringify(dataInJson);

        chrome.storage.local.set({"FleetMarks_LinksData": dataToSet}, function() {
            console.log('Value in storage has been updated to:  ' + dataToSet);

            getAllFromStorageAndSetInHtml();
          });
    });

}

function clearStorage() {

    chrome.storage.local.clear(function() {
        console.log('Storage has been cleared');
     });

}

function getAllFromStorageAndSetInHtml() {

    chrome.storage.local.get(["FleetMarks_LinksData"], function(result) {
        console.log('Value got from storage is: ' + result.FleetMarks_LinksData);
        var rawData = result.FleetMarks_LinksData

        dataInJson = {}
        if (rawData) {
            try {
                dataInJson = JSON.parse(rawData);
            } catch (ex) {
                console.log('There was a problem with data parsing!');
            }
        }

        for (const elem in dataInJson) {
            var link = elem;
            var title = dataInJson[elem];

            var table = document.getElementById('listOfLinks');

            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var ahref = document.createElement("a");

            ahref.textContent = title;
            ahref.href = link;
            ahref.target = "_blank";

            td.appendChild(ahref);
            tr.appendChild(td);
            table.appendChild(tr);
        }
    });

}

getAllFromStorageAndSetInHtml();

document.addEventListener('DOMContentLoaded', function() {

    var saveTabButton = document.getElementById('saveTab');

    saveTabButton.addEventListener('click', function() {
      chrome.tabs.getSelected(null, function(tab) {
        saveLinkToStorage(tab.title, tab.url);
      });
    }, false);

    var saveAndCloseTabButton = document.getElementById('saveAndCloseTab');

    saveAndCloseTabButton.addEventListener('click', function() {
      chrome.tabs.getSelected(null, function(tab) {
        saveLinkToStorage(tab.title, tab.url);
        chrome.tabs.remove(tab.id, function() { });
      });
    }, false);

    var deleteAllButton = document.getElementById('deleteAll');

    deleteAllButton.addEventListener('click', function() {
        clearStorage();
    }, false);

  }, false
);
