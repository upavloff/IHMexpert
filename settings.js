const inputPassword = document.getElementById("input-password");
inputPassword.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        validatePassword(inputPassword.value);
    }
});

const arrow = document.getElementById("password-arrow");
arrow.addEventListener('click', () => {
    validatePassword(inputPassword.value);
});

const passContainer = document.getElementById("pass");
passContainer.addEventListener('animationend', () => {
    passContainer.style.animation = "";
});


function validatePassword(password) {
    fetch('/password')
        .then(response => response.json())
        .then(pass => {
            const truePassword = pass.password;
            if (truePassword == password) {
                document.body.style.backgroundColor = 'white';
                document.getElementById("after-login").style.display = "block";
                passContainer.style.display = "none";
            } else {
                document.body.style.backgroundColor = 'rgb(189,87,87)';
                passContainer.style.animation = "shake 0.5s ease";
            }
        })
        .catch(err => {
            console.log("erreur dans la recherhe de password");
            console.log(err);
        })
}

function updateSee() {
    fetch('/settings')
        .then(response => response.json())
        .then(data => {
            const gameParameters = data[0];
            console.log(gameParameters);
            document.getElementById("nbTrials").value = gameParameters.nbTrials;
            document.getElementById("nbTrialsOutput").innerHTML = gameParameters.nbTrials;
            document.getElementById("nbLocks").value = gameParameters.nbLocks;
            for (var form of gameParameters.formList) {
                document.getElementById(form).checked = true;
            }
        })
        .catch(err => {
            console.log("damn y a une erreur");
        })
}
updateSee();

//------------------------------------------------------------------
//                          update settings
//------------------------------------------------------------------
const gameSettings = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: {}
};

const forms = [
    document.getElementById("Square"),
    document.getElementById("Circle"),
    document.getElementById("Triangle"),
    document.getElementById("Cross")
]

async function updateSettings() {
    var cptFormCecked = 0;
    for (var form of forms) {
        if (form.checked) {
            cptFormCecked += 1;
        }
        form.required = false;
        form.setCustomValidity("");
    }
    if (cptFormCecked < 2) {
        for (form of forms) {
            if (!form.checked) {
                form.required = true;
                form.setCustomValidity("Selectionnez au moins deux formes"); //validity.valueMissing ? 'Please indicate that you accept the Terms and Conditions' : '');
                //form.required = true;
                //document.getElementById("settingsForm").validity = false;
                return;
            }
        }
    }
    const nbTrials = document.getElementById("nbTrials").value;
    const nbLocks = document.getElementById("nbLocks").value;
    var formList = [];
    for (var form of forms) {
        if (form.checked) {
            formList.push(form.id);
        }
    }
    gameSettings.body = JSON.stringify({
        nbTrials: nbTrials,
        nbLocks: nbLocks,
        formList: formList
    });
    const response = await fetch('/settings', gameSettings);
    const res = await response.json();
    console.log(res);
    //document.getElementById("indexRef").style = "";
    updateSee();
}


//------------------------------------------------------------------
//                          csv to json
//------------------------------------------------------------------

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
        alert(file.name + " is not a CSV files")
        printToOutput("  Choose CSV files");
        return; // stop trying to do the other stuff in this function
    }
    //display file.name
    document.getElementById("fileName").innerHTML = file.name;
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