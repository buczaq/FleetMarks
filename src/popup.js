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

        const titleLengthLimit = 60;
        if (title.length > 60) {
            title = title.substr(0, titleLengthLimit) + "...";
        }

        dataInJson[link] = title;
        var dataToSet = JSON.stringify(dataInJson);

        chrome.storage.local.set({"FleetMarks_LinksData": dataToSet}, function() {
            console.log('Value in storage has been updated to:  ' + dataToSet);
            getAllFromStorageAndSetInHtml();
          });
    });

}

function clearHtml() {
    var links = document.getElementsByClassName("linksTableEntry");

    for (var index = 0; index < links.length; index++) {
        links[index].remove();
    }
}

function clearStorage() {

    chrome.storage.local.clear(function() {
        console.log('Storage has been cleared');
     });

}

function getAllFromStorageAndSetInHtml() {

    chrome.storage.local.get(["FleetMarks_LinksData"], function(result) {
        // TODO - why does it have to be called so many times? One-time call doesn't clear whole view sometimes.
        clearHtml();
        clearHtml();
        clearHtml();
        clearHtml();
        clearHtml();
        clearHtml();
        clearHtml();
        clearHtml();
        clearHtml();
        clearHtml();

        console.log('Value got from storage is: ' + result.FleetMarks_LinksData);
        var rawData = result.FleetMarks_LinksData

        dataInJson = {}
        if (rawData) {
            try {
                dataInJson = JSON.parse(rawData);
            } catch (ex) {
                console.log('There was a problem with data parsing!');
            }
        } else {
            var table = document.getElementById('listOfLinks');

            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var i = document.createElement("i");

            i.textContent = "There are no links yet - add some!";

            td.appendChild(i);
            tr.appendChild(td);
            table.appendChild(tr);

            return;
        }

        for (const elem in dataInJson) {
            var link = elem;
            var title = dataInJson[elem];

            console.log("Setting: " + link + " " + title);

            var table = document.getElementById('listOfLinks');

            var tr = document.createElement("tr");
            tr.className = "linksTableEntry";

            var td = document.createElement("td");
            var ahref = document.createElement("a");

            ahref.textContent = title;
            ahref.href = link;
            ahref.target = "_blank";
            ahref.className = "linkEntry";

            td.appendChild(ahref);
            tr.appendChild(td);
            table.appendChild(tr);
        }

        addListenersForAllLinks();
    });

}

function addListenersForAllLinks() {

    var links = document.getElementsByClassName("linkEntry");

    for (var index = 0; index < links.length; index++) {
        links[index].addEventListener('click', function(clickedElement) {
            var link = clickedElement.target.href;

            chrome.storage.local.get(["FleetMarks_LinksData"], function(result) {
                console.log('Value got from storage is: ' + result.FleetMarks_LinksData);
                var rawData = result.FleetMarks_LinksData;

                dataInJson = {}
                if (rawData) {
                    try {
                        dataInJson = JSON.parse(rawData);
                    } catch (ex) {
                        console.log('There was a problem with data parsing!');
                    }
                }

                console.log("Deleting link: " + link);

                delete dataInJson[link];

                var dataToSet = JSON.stringify(dataInJson);

                chrome.storage.local.set({"FleetMarks_LinksData": dataToSet}, function() {
                    console.log('Value in storage has been updated to:  ' + dataToSet);
                    getAllFromStorageAndSetInHtml();
                });
            });
        }, false);
    }

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
        getAllFromStorageAndSetInHtml();
    }, false);

  }, false
);
