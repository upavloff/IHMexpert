let json; // will hold the parsed JSON
let output = document.getElementById("json-output"); // for easy access to this element

function csvToJSON(csv) {
    var lines = csv.split("\r\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    //console.log(result);
    return result; //JSON
}

// this function is called when a "change" event happens on the "input" element in the HTML
function loadFile(event) {
    output.innerHTML = ""; // make sure to clear the output when getting a new file
    let file = event.target.files[0]; // the "change" event itself gets passed to this function

    // make sure the file is a CSV
    if (file.type !== "text/csv") {
        printToOutput("This app can only take CSV files!");
        return; // stop trying to do the other stuff in this function
    }

    // read the file with FileReader
    const reader = new FileReader();
    reader.onload = function(e) {
        // this function is called when the reader reads the file
        // use d3-dsv to parse the CSV
        //json = d3.csvParse(e.target.result, d3.autoType);
        json = csvToJSON(e.target.result)
        printToOutput(JSON.stringify(json, null, 4));
    };
    // reader reads the text of the file, triggering the "onload" function
    reader.readAsText(file);
}


function printToOutput(text) {
    output.innerHTML = "<pre>" + text + "</pre>"; //<br><br><br>
    //console.log(text);
}

document.getElementById("uploadButton").addEventListener("change", loadFile);