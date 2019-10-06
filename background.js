// make sure to add images for 16, 64, 128 bits


// create context menu:
// if according menu is clicked -> send the highlighted context to pop with storage operation

var contextMenu = {
    "id": "quote",
    "title": "Quote",
    "contexts": ["selection"]   // check Chrome dev to see more option
};

// create event handler
chrome.contextMenus.create(contextMenu);

let urls = [];
let summaries = [];
let quotes = [];
let dataSet = {quotes:quotes, urls:urls, summaries:summaries};

chrome.contextMenus.onClicked.addListener(function(menuClicked) {
    chrome.storage.sync.get(["dataSet"], function(result) {
        if(result.dataSet !== undefined) {
            console.log("get: " + result.dataSet.quotes);
            quotes = result.dataSet.quotes;
            urls = result.dataSet.urls;
            summaries = result.dataSet.summaries;
        }
        if(menuClicked.menuItemId === "quote" && menuClicked.selectionText) {
            quotes.push(menuClicked.selectionText);
            urls.push(menuClicked.pageUrl);
            summaries.push("summary");
            console.log("summary is added: " + summaries[summaries.length - 1]);
            dataSet.quotes = quotes;
            dataSet.urls = urls;
            dataSet.summaries = summaries;
            chrome.storage.sync.set({"dataSet": dataSet}, function() {
                // console.log("dataSet value is stored successfully");
                console.log("set: " + dataSet.quotes);
            })
        }
    });
});

