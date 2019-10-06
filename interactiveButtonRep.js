// data members

// let urls = ["url 0", "url 1", "url 2"];                         // delete once tested as extension
// let summaries = ["summary 0", "summary 1", "summary 2"];        // delete once tested as extension
// let quotes = ["quote 0", "quote 1", "quote 2"];                 // delete once tested as extension
let dataSet;  // delete once tested as extension

let selectedRow = -1;
let rows = [];
let copies = [];
let deletes = [];

// element styles
let rowStyle = "  position: relative;\n" +
    "  display: inline-block;\n";
let tooltipStyle = "  visibility: visible;\n" +
    "  width: 120px;\n" +
    "  background-color: black;\n" +
    "  color: #fff;\n" +
    "  text-align: center;\n" +
    "  border-radius: 6px;\n" +
    "  padding: 5px 0;\n" +
    "  \n" +
    "  /* Position the tooltip */\n" +
    "  position: absolute;\n" +
    "  z-index: 1;\n" +
    "  top: 100%;\n" +
    "  left: 50%;\n" +
    "  margin-left: -60px;";


// when popup opens
chrome.storage.sync.get(["dataSet"], function(result) {
    console.log("data is retrieved correctly");
    dataSet = result.dataSet;
    initialize();
});

document.getElementById("enter").addEventListener('click', clickEnter);
function clickEnter() {
    let summaryText = document.getElementById("summary").value;
    if(selectedRow !== -1) {
        dataSet.summaries[selectedRow] = summaryText;
        // need to uncomment when do communication test with chrome
        chrome.storage.sync.set({"dataSet": dataSet}, function() {
        });
            console.log("dataSet is stored successfully");
        // delete the old components
        let element = document.getElementById("quotes");
        // console.log("element count: "+ element.childElementCount);
        for(let i = 0; i < rows.length; i++) {
            element.removeChild(rows[i]);
        }
        initialize();
    }
    else{
        alert("need to select the quote you want to add summary on");
    }
}

// init
function initialize() {
    // re-init the members
    selectedRow = -1;
    rows = [];
    copies = [];
    deletes = [];

    // add elements to html
    generateComponents();

    // add listeners
    rowAddListener();
    copyButtonAddListener();
    deleteButtonAddListener();
}

function generateComponents() {
    let numOfQuotes;
    console.log(dataSet);
    if(dataSet === undefined) {
        numOfQuotes = 0;
    }
    else {
        numOfQuotes = dataSet.quotes.length;
    }
    for(let i = 0; i < numOfQuotes; i++) {
        // declare and init properties for components
        let tableRow = document.createElement("tr");
        tableRow.id = "row" + i;
        tableRow.style.cssText = rowStyle;
        let tableCol1 = document.createElement("td");
        tableCol1.innerHTML = dataSet.quotes[i];
        tableCol1.id = "quote" + i;
        tableCol1.className = "quoteCol";
        let tooltip = document.createElement("span");
        tooltip.id = "tooltip" + i;
        tooltip.innerText = dataSet.summaries[i];
        tooltip.style.cssText = tooltipStyle + "visibility: hidden;";
        let tableCol2 = document.createElement("td");
        let tableColCopyBtn = document.createElement("button");
        tableColCopyBtn.id = "copy" + i;
        tableColCopyBtn.innerHTML = "copy";
        let tableColDelBtn = document.createElement("button");
        tableColDelBtn.id = "delete" + i;
        tableColDelBtn.innerHTML = "delete";

        // add components to according parents
        tableCol1.appendChild(tooltip);
        tableRow.appendChild(tableCol1);
        tableCol2.appendChild(tableColCopyBtn);
        tableCol2.appendChild(tableColDelBtn);
        tableRow.appendChild(tableCol2);
        document.getElementById("quotes").appendChild(tableRow);
    }
}

// select the row
function rowAddListener() {
    rows = getElementsByIdStartsWith("tr", "row");
    if(rows != null) {
        for(let i = 0; i < rows.length; i++) {
            let rowID = rows[i].id;
            // console.log("row" + i + " listener added\n  row ID: " + rowID);
            document.getElementById(rowID).i = i;

            document.getElementById(rowID).addEventListener("click", clickRow);    // click listener
            document.getElementById(rowID).addEventListener("mouseenter", mouseenterRow);// mouseenter listener
            document.getElementById(rowID).addEventListener("mouseleave", mouseleaveRow);// mouseleave listener
        }
    }
}

function clickRow(event) {
    let nthRow = event.currentTarget.i;
    // console.log("row" + nthRow + " is clicked");
    let prevSelectedRowID = "row" + selectedRow;
    let curSelectedRowID = "row" + nthRow;
    // console.log(curSelectedRowID);
    if(nthRow !== rows.length && document.getElementById(rows[nthRow].id) != null) {
        if(selectedRow !== -1) {
            // console.log("un-highlight is accessed");
            document.getElementById(prevSelectedRowID).style.backgroundColor = null;
        }
        document.getElementById(curSelectedRowID).style.backgroundColor = "rgba(14,100,80,0.5)";
        selectedRow = nthRow;
        // console.log("highlight change successful");
    }
    // else console.log("ERROR! there is not rows" + nthRow);
}

function mouseenterRow(event) {
    let nthRow = event.currentTarget.i;
    // console.log("row" + nthRow + " mouse is entered the tool tip");
    document.getElementById("tooltip" + nthRow).style.cssText = tooltipStyle + "visibility: visible";
}

function mouseleaveRow(event) {
    let nthRow = event.currentTarget.i;
    // console.log("row" + nthRow + " mouse left the tool tip");
    document.getElementById("tooltip" + nthRow).style.cssText = tooltipStyle + "visibility: hidden";
}

// copy button listener
function copyButtonAddListener() {
    copies = getElementsByIdStartsWith("button", "copy");
    if(copies != null) {
        for(let i = 0; i < copies.length; i++) {
            let copyID = copies[i].id;
            // console.log("copy" + i + " listener added\n  row ID: " + copyID);
            document.getElementById(copyID).i = i;

            document.getElementById(copyID).addEventListener("click", clickCopy);    // click listener
        }
    }
}

function clickCopy(event) {
    let nthRow = event.currentTarget.i;
    let quoteCopied = document.getElementById("quote" + nthRow).innerText;
    navigator.clipboard.writeText(quoteCopied).then(function () {
        console.log("copy success - copied quote is: " + quoteCopied);
    }, function () {
        console.log("copy fail");
    })
}

// delete button listener
function deleteButtonAddListener() {
    deletes = getElementsByIdStartsWith("button", "delete");
    if(deletes != null) {
        for(let i = 0; i < deletes.length; i++) {
            let deleteID = deletes[i].id;
            // console.log("delete" + i + " listener added\n delete ID: " + deleteID);
            document.getElementById(deleteID).i = i;

            document.getElementById(deleteID).addEventListener("click", clickDelete);
        }
    }
}

function clickDelete(event) {
    let nthRow = event.currentTarget.i;

    dataSet.quotes.splice(nthRow, 1);
    console.log(dataSet.quotes.length); // should print quote2
    dataSet.urls.splice(nthRow, 1);
    dataSet.summaries.splice(nthRow, 1);
    // need to uncomment when do communication test with chrome
    chrome.storage.sync.set({"dataSet": dataSet}, function() {
        console.log("dataSet is stored successfully")
    });
    // delete the old components
    let element = document.getElementById("quotes");
    // console.log("element count: "+ element.childElementCount);
    for(let i = 0; i < rows.length; i++) {
        element.removeChild(rows[i]);
    }
    initialize();
}


// helper methods
function getElementsByIdStartsWith(selectorTag, prefix) {
    let items = [];
    let myPosts = document.getElementsByTagName(selectorTag);
    for (let i = 0; i < myPosts.length; i++) {
        //omitting undefined null check for brevity
        if (myPosts[i].id.lastIndexOf(prefix, 0) === 0) {
            items.push(myPosts[i]);
        }
    }
    return items;
}