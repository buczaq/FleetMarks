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

    chrome.storage.local.remove(["FleetMarks_LinksData"], function() {
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
        var rawData = result.FleetMarks_LinksData;

        dataInJson = {};
        if (rawData && rawData.length > 0 && rawData.toString() != "{}") {
            console.log("Found rawData - it's: " + rawData);
            try {
                dataInJson = JSON.parse(rawData);
            } catch (ex) {
                console.log('There was a problem with data parsing!');
            }
        } else {
            console.log('Setting empty links info');

            var table = document.getElementById('listOfLinks');

            var tr = document.createElement("tr");
            tr.className = "linksTableEntry";

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

            var randomSeedIdentifier = Math.random().toString();

            // link
            var td1 = document.createElement("td");
            var ahref = document.createElement("a");

            ahref.textContent = "• " + title;
            ahref.href = link;
            ahref.target = "_blank";
            ahref.className = "linkEntry";
            ahref.id = randomSeedIdentifier + "_link";

            // remove button for link
            var td2 = document.createElement("td");
            td2.className = "entryRemoverParent";
            var b = document.createElement("b");

            b.textContent = "ⓧ";
            b.id = randomSeedIdentifier;
            b.className = "entryRemover";

            td1.appendChild(ahref);
            td2.appendChild(b);
            tr.appendChild(td1);
            tr.appendChild(td2);
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

                var deleteOnClickToggleIsChecked = document.getElementById("deleteOnClickToggle").checked;

                if (deleteOnClickToggleIsChecked) {
                    delete dataInJson[link];

                    var dataToSet = JSON.stringify(dataInJson);

                    chrome.storage.local.set({"FleetMarks_LinksData": dataToSet}, function() {
                        console.log('Value in storage has been updated to: ' + dataToSet);
                        getAllFromStorageAndSetInHtml();
                    });
                }
            });
        }, false);
    }

    var removers = document.getElementsByClassName("entryRemover");

    for (var index = 0; index < removers.length; index++) {
        removers[index].addEventListener('click', function(clickedElement) {
            var id = clickedElement.target.id;
            var link = document.getElementById(id + "_link");

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

    var deleteOnClickToggle = document.getElementById("deleteOnClickToggle");

    deleteOnClickToggle.addEventListener('click', function(clickedElement) {
        var checked = clickedElement.target.checked;

        var toSet;
        if (checked) {
            toSet = "true";
        } else {
            toSet = "false";
        }

        chrome.storage.local.set({"FleetMarks_deleteOnClickToggle": toSet}, function() {
            console.log('Value of deleteOnClickToggle in storage has been updated to:  ' + toSet);
            getAllFromStorageAndSetInHtml();
        });
    }, false);

}

function getDeleteOnClickToggleFromStorageAndSetInHtml() {

    chrome.storage.local.get(["FleetMarks_deleteOnClickToggle"], function(result) {
        console.log('deleteOnClickToggle is set in storage to:  ' + result.FleetMarks_deleteOnClickToggle);

        var deleteOnClickToggle = document.getElementById("deleteOnClickToggle");

        if (result.FleetMarks_deleteOnClickToggle == "true") {
            deleteOnClickToggle.checked = true;
        } else if (result.FleetMarks_deleteOnClickToggle == "false") {
            deleteOnClickToggle.checked = false;
        }
         
    });

}

getAllFromStorageAndSetInHtml();
getDeleteOnClickToggleFromStorageAndSetInHtml();

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
