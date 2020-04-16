//login stuff
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

//settings stuff

function updateSee() {
    fetch('/settings')
        .then(response => response.json())
        .then(data => {
            const gameParameters = data[0];
            console.log(gameParameters);
            document.getElementById("nbBlocksToDo").value = gameParameters.nbBlocksToDo;
            //forms freq
            const formsFrequence = gameParameters.formsFrequence;
            document.getElementById('nbForms').value = formsFrequence.length;
            //update freq
            const formsFrequenceInput = document.getElementsByClassName("formFrequence");
            let i = 0;
            Array.prototype.forEach.call(formsFrequenceInput, freq => {
                if (freq.required) {
                    freq.value = formsFrequence[i]
                    i++;
                }
            });
            //form list
            const inputFormList = document.getElementsByClassName("selectForm");
            const formList = gameParameters.formList;
            Array.prototype.forEach.call(inputFormList, formCheckbox => {
                if (formList.includes(formCheckbox.value)) {
                    formCheckbox.checked = true;
                }
            });
            document.getElementById('nbTargetToSelect').value = gameParameters.nbTargetToSelect;
            //nbLocks
            document.getElementById("nbLockList").value = gameParameters.nbLockList;
            //slider
            document.getElementById('nbSlidesToUnlock').value = gameParameters.nbSlidesToUnlock;
            document.getElementById('timeBeforeSliderDisappear').value = gameParameters.timeBeforeSliderDisappear;
            //timeline radio button
            if (gameParameters.displayTimeline) {
                document.getElementById("displayTimeline").checked = true;
            } else {
                document.getElementById("notDisplayTimeline").checked = true;
            }
            updateFormsDisplay(formsFrequence.length);
        })
        .catch(err => {
            console.log(err);
            console.log("damn y a une erreur dans le chargement des valeurs");
        })
}
updateSee();


function updateFormsDisplay(value) {
    for (let i = 2; i <= value; i++) {
        document.getElementById('freqFigure' + String(i)).required = true;
        document.getElementById('figure' + String(i)).style.display = '';
    }
    for (let i = value + 1; i <= 4; i++) {
        document.getElementById('freqFigure' + String(i)).required = false;
        document.getElementById('figure' + String(i)).style.display = 'none';
    }
    document.getElementById('nbFormsOutput').value = value;
    //update div display :
    const formsFrequenceInput = document.getElementsByClassName("formFrequence");
    let totalFreq = 0;
    Array.prototype.forEach.call(formsFrequenceInput, freq => {
        if (freq.required) {
            totalFreq += parseInt(freq.value);
        }
    });
    document.getElementById('blockSize').innerHTML = totalFreq;
    document.getElementById('infoNbTotalTrials').innerHTML = totalFreq * document.getElementById('nbBlocksToDo').value;
    document.getElementById('infoFigs').innerHTML = document.getElementById('nbForms').value;
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
    //updating effect 
    document.getElementById('indexRef').style.display = 'none';
    document.getElementById('waitSpinner').style.display = '';
    setTimeout(() => { document.getElementById('waitSpinner').style.display = 'none'; }, 2000);
    //----------------  real updates  -------------------------------
    //blocks to do
    const nbBlocksToDo = parseInt(document.getElementById("nbBlocksToDo").value);

    //formFrequence and nb figures by block
    const formsFrequenceInput = document.getElementsByClassName("formFrequence");
    var formsFrequence = [];
    var nbFormsByBlock = 0;
    Array.prototype.forEach.call(formsFrequenceInput, freq => {
        if (freq.required) {
            formsFrequence.push(freq.value);
            nbFormsByBlock += parseInt(freq.value);
        }
    });

    //padLocks settings
    const inputNbLockList = document.getElementById("nbLockList")
    inputNbLockList.setCustomValidity('');
    var nbLockList = inputNbLockList.value.split(",").map(x => +x);
    if (nbLockList.length < 2) {
        inputNbLockList.setCustomValidity('List of padlocks should contain at least two values');
        return;
    }
    //form list
    const inputFormList = document.getElementsByClassName("selectForm");
    var formList = [];
    Array.prototype.forEach.call(inputFormList, formCheckbox => {
        formCheckbox.setCustomValidity(""); //reinitialise pour pas causer de pb
        if (formCheckbox.checked) {
            formList.push(formCheckbox.value);
        }
    });
    if (formList.length < document.getElementById("nbForms").value) {
        for (formCheckbox of inputFormList) {
            if (!formCheckbox.checked) {
                formCheckbox.setCustomValidity("Number of forms selected must be at least equals to the number of forms");
                return;
            }
        }
    }
    const nbTargetToSelect = parseInt(document.getElementById('nbTargetToSelect').value);
    const nbSlidesToUnlock = parseInt(document.getElementById('nbSlidesToUnlock').value);
    const timeBeforeSliderDisappear = parseInt(document.getElementById('timeBeforeSliderDisappear').value);
    const displayTimeline = document.getElementById("displayTimeline").checked;

    gameSettings.body = JSON.stringify({
        nbBlocksToDo: nbBlocksToDo,
        nbFormsByBlock: nbFormsByBlock,
        formsFrequence: formsFrequence,
        formList: formList,
        nbTargetToSelect: nbTargetToSelect,
        nbLockList: nbLockList,
        nbSlidesToUnlock: nbSlidesToUnlock,
        timeBeforeSliderDisappear: timeBeforeSliderDisappear,
        displayTimeline: displayTimeline
    });

    const response = await fetch('/settings', gameSettings);
    const res = await response.json();
    console.log(res);
    setTimeout(() => { document.getElementById('indexRef').style.display = ''; }, 2000);
}