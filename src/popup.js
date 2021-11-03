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

        chrome.storage.local.set({"FleetMarks_LinksData": dataToSet}, function() {
            console.log('Value in storage has been updated to:  ' + dataToSet);
          });
    });

}

document.addEventListener('DOMContentLoaded', function() {
    var saveTabButton = document.getElementById('saveTab');

    saveTabButton.addEventListener('click', function() {
      chrome.tabs.getSelected(null, function(tab) {
        saveLinkToStorage(tab.url, tab.title);
      });
    }, false);

  }, false);
