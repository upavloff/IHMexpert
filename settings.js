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

const blockList = [];

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
            document.getElementById("nbFiguresByBlock").value = gameParameters.nbFiguresByBlock;
            document.getElementById("nbBlocksToDo").value = gameParameters.nbBlocksToDo;
            //document.getElementById("nbTrialsOutput").innerHTML = gameParameters.nbTrials;
            addBlock(gameParameters.blockList);
            document.getElementById("nbLocks").value = gameParameters.nbLocks;
            if (gameParameters.easyMode) {
                document.getElementById("easyModeTrue").checked = true;
            } else {
                document.getElementById("easyModeFalse").checked = true;
            }
            if (gameParameters.displayTimeline) {
                document.getElementById("displayTimeline").checked = true;
            } else {
                document.getElementById("notDisplayTimeline").checked = true;
            }
        })
        .catch(err => {
            console.log(err);
            console.log("damn y a une erreur dans le chargement des valeurs");
        })
}
updateSee();

//------------------------------------------------------------------
//                          add block
//------------------------------------------------------------------

var numeroBlock = 1;

function addBlock(blocks = [{}]) {
    blocks.forEach(block => {
        blockList.push({});
        //main paragraph
        const currentDiv = document.createElement('div');
        currentDiv.className = "Block";
        currentDiv.id = "Block" + numeroBlock;
        currentDiv.appendChild(document.createTextNode("Block " + numeroBlock + " "));
        //display triangle button

        const triangleDown = document.createElement('i');
        triangleDown.className = "fa fa-caret-down";
        triangleDown.style = "cursor: pointer";
        triangleDown.addEventListener("click", () => {
            if (triangleDown.className == "fa fa-caret-down") {
                const son = triangleDown.nextElementSibling;
                son.style.display = "";
                triangleDown.className = "fa fa-caret-up";
                son.nextElementSibling.style.display = "";
            } else {
                const son = triangleDown.nextElementSibling;
                son.style.display = "none";
                son.nextElementSibling.style.display = "none";
                triangleDown.className = "fa fa-caret-down";
            }

        });
        //choice para
        const formChoice = document.createElement('p');
        formChoice.className = "figureChoice";
        formChoice.innerHTML += "Choose figures : "; //<input type = \"checkbox\" id = \"Square\" name = \"Square\" value = \"Square\" > Square <input type = \"checkbox\" id = \"Circle\" name = \"Circle\" value = \"Circle\" > Circle <input type = \"checkbox\" id = \"Triangle\" name = \"Triangle\" value = \"Triangle\" > Triangle <input type = \"checkbox\" id = \"Cross\" name = \"Cross\" value = \"Cross\" > Cross ";
        for (form of["Square", "Circle", "Triangle", "Cross"]) {
            const formDiv = document.createElement('div');
            const input = document.createElement('input')
            input.type = "checkbox";
            input.id = form + numeroBlock;
            input.name = form;
            input.value = form;
            input.textContent = form;

            input.onchange = () => {
                if (input.checked) {
                    const formNb = document.createElement('input');
                    formNb.name = "figureNumber";
                    formNb.type = "number";
                    formNb.required = true;
                    formNb.min = 1;
                    formDiv.appendChild(formNb);
                    //update blockList
                    formNb.onchange = () => {
                        blockList[currentDiv.id[5] - 1][input.value] = parseInt(formNb.value);
                    };

                } else {
                    input.nextElementSibling.remove();
                    delete blockList[currentDiv.id[5] - 1][input.value];
                    if (Object.keys(blockList[currentDiv.id[5] - 1]).length == 0) {
                        blockList.splice(currentDiv.id[5] - 1, 1);
                    }
                    console.log(blockList);
                }
            };


            formDiv.appendChild(input);
            formDiv.appendChild(document.createTextNode(form + "   "));
            if (block[form]) {
                input.checked = true;
                const formNb = document.createElement('input');
                formNb.name = "figureNumber";
                formNb.type = "number";
                formNb.required = true;
                formNb.value = block[form];
                formNb.min = 1;
                formDiv.appendChild(formNb);
                blockList[currentDiv.id[5] - 1][input.value] = parseInt(formNb.value);
                formNb.onchange = () => {
                    blockList[currentDiv.id[5] - 1][input.value] = parseInt(formNb.value);
                };
            }
            formChoice.appendChild(formDiv);
        }
        formChoice.style.marginLeft = "20px";
        formChoice.style.display = "none";

        //delete block option
        const deleteBlock = document.createElement('i');
        deleteBlock.className = "fa fa-trash";
        deleteBlock.style = "cursor: pointer";
        deleteBlock.addEventListener("click", () => {
            deleteBlock.parentElement.remove();
            const blocks = document.querySelectorAll(".Block");
            numeroBlock = 1;
            blocks.forEach(block => {
                block.id = "Block" + numeroBlock;
                block.childNodes[0].nodeValue = "Block " + numeroBlock + " ";
                numeroBlock += 1;
            });
        });
        deleteBlock.style.marginLeft = "20px";
        deleteBlock.style.display = "none";

        currentDiv.appendChild(triangleDown);
        currentDiv.appendChild(formChoice);
        currentDiv.appendChild(deleteBlock);


        const listBlock = document.getElementById("listBlock");
        listBlock.appendChild(currentDiv);

        numeroBlock += 1;
    });

}


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
    const nbFiguresByBlock = document.getElementById("nbFiguresByBlock").value;
    const nbBlocksToDo = document.getElementById("nbBlocksToDo").value;
    const nbLocks = document.getElementById("nbLocks").value;
    const figureChoiceBlocks = document.querySelectorAll(".figureChoice");
    var erreur = false;
    if (figureChoiceBlocks.length == 0) {
        alert('Créez au moins un block');
        erreur = true;
        return;
    }
    const inputList = document.getElementsByName("figureNumber");
    console.log(inputList);
    var indexBlock = 0;
    figureChoiceBlocks.forEach(choiceBlock => {
        var sumInputs = 0;
        var persistantInput;
        var BreakException = {};
        try {
            inputList.forEach(input => {
                input.setCustomValidity("");
                if (choiceBlock == input.parentElement.parentElement) {
                    sumInputs += parseInt(input.value);
                    persistantInput = input;
                    if (sumInputs > nbFiguresByBlock) {
                        console.log('nbFiguresByBlock is ' + nbFiguresByBlock);
                        console.log("sumInputs is", sumInputs);
                        input.setCustomValidity("le nombre de forme doit etre égale au nombre d'essais dans chaque block");
                        erreur = true;
                        throw BreakException;
                    }
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
            return;
        }
        if (sumInputs == 0) {
            choiceBlock.parentElement.remove();
            blockList.splice(indexBlock, 1);
            erreur = true;
            return;
        } else if (sumInputs != nbFiguresByBlock) {
            persistantInput.setCustomValidity("le nombre de forme doit etre égale au nombre d'essais dans chaque block");
            erreur = true;
            return;
        }
        indexBlock += 1;
    });
    var formChecked = {};
    inputList.forEach(input => {
        formChecked[input.previousElementSibling.value] = true;
    });
    const formList = Object.keys(formChecked);
    if (Object.keys(formChecked).length < 2) {
        alert('You have to select at least two forms');
        erreur = true;
        return;
    }
    const easyMode = document.getElementById("easyModeTrue").checked;
    const displayTimeline = document.getElementById("displayTimeline").checked;

    gameSettings.body = JSON.stringify({
        nbBlocksToDo: nbBlocksToDo,
        nbFiguresByBlock: nbFiguresByBlock,
        blockList: blockList,
        nbLocks: nbLocks,
        formList: formList,
        easyMode: easyMode,
        displayTimeline: displayTimeline
    });
    if (!erreur) {
        const response = await fetch('/settings', gameSettings);
        const res = await response.json();
        console.log(res);
    }
    //document.getElementById("indexRef").style = "";
    //updateSee();
}


//------------------------------------------------------------------
//                          csv to json
//------------------------------------------------------------------
/*
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
*/