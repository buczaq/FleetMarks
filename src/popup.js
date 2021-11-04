function setLinkInHtml(title, link) {

    var link1 = document.getElementById('link1');
    link1.textContent = title;
    link1.href = link;

}

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

        dataInJson[title] = link;
        var dataToSet = JSON.stringify(dataInJson);

        setLinkInHtml(title, link);

        chrome.storage.local.set({"FleetMarks_LinksData": dataToSet}, function() {
            console.log('Value in storage has been updated to:  ' + dataToSet);
          });
    });

}

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
        saveLinkToStorage(tab.url, tab.title);
        chrome.tabs.remove(tab.id, function() { });
      });
    }, false);

  }, false
);
