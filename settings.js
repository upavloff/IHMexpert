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

const listBetweenElement = [];


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
            //nbLocks - slider
            addBetweenElement(gameParameters.betweenElements);
            //timeline radio button
            if (gameParameters.displayTimeline) {
                document.getElementById("displayTimeline").checked = true;
            } else {
                document.getElementById("notDisplayTimeline").checked = true;
            }
            if (gameParameters.authorizeRetest) {
                document.getElementById("authorizeRetest").checked = true;
            } else {
                document.getElementById("notAuthorizeRetest").checked = true;
            }
            updateFormsDisplay(formsFrequence.length);
        })
        .catch(err => {
            console.log(err);
            console.log("damn y a une erreur dans le chargement des valeurs");
        })
}
updateSee();

var numeroBetweenElement = 1;

function addBetweenElement(btwElmtList = [{}]) {
    btwElmtList.forEach(element => {
        listBetweenElement.push({});
        //main paragraph
        const currentDiv = document.createElement('div');
        currentDiv.className = "BetweenElement";
        currentDiv.id = "BetweenElement" + numeroBetweenElement;
        currentDiv.appendChild(document.createTextNode("BetweenElement " + numeroBetweenElement + " "));
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
                son.nextElementSibling.nextElementSibling.style.display = "";
                son.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "";
            } else {
                const son = triangleDown.nextElementSibling;
                son.style.display = "none";
                son.nextElementSibling.style.display = "none";
                son.nextElementSibling.nextElementSibling.style.display = "none";
                son.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "none";
                triangleDown.className = "fa fa-caret-down";
            }

        });
        //Locks 
        const nbLock = document.createElement('p');
        nbLock.className = "nbLock";
        nbLock.innerHTML = "Number of padlocks :";
        const inputLock = document.createElement('input');
        inputLock.type = "number";
        inputLock.id = "nbLock" + numeroBetweenElement;
        inputLock.name = "padlock";
        inputLock.min = "1";
        inputLock.required = true;
        if (element.nbLock) {
            inputLock.value = element.nbLock;
        }
        nbLock.appendChild(inputLock);
        nbLock.style.marginLeft = "20px";
        nbLock.style.display = "none";

        //Number of slides
        const nbSlidesToUnlock = document.createElement('p');
        nbSlidesToUnlock.className = "nbSlidesToUnlock";
        nbSlidesToUnlock.innerHTML = "Number of Slides to unlock  :";
        const inputNbSlidesToUnlock = document.createElement('input');
        inputNbSlidesToUnlock.type = "number";
        inputNbSlidesToUnlock.id = "nbSlidesToUnlock" + numeroBetweenElement;
        inputNbSlidesToUnlock.name = "nbSlides";
        inputNbSlidesToUnlock.min = "1";
        inputNbSlidesToUnlock.required = true;
        if (element.nbSlides) {
            inputNbSlidesToUnlock.value = element.nbSlides;
        }
        //inputNbSlidesToUnlock.value = form;
        nbSlidesToUnlock.appendChild(inputNbSlidesToUnlock);
        nbSlidesToUnlock.style.marginLeft = "20px";
        nbSlidesToUnlock.style.display = "none";

        //timer slider
        const timeBeforeSliderDisappear = document.createElement('p');
        timeBeforeSliderDisappear.className = "timeBeforeSliderDisappear";
        timeBeforeSliderDisappear.innerHTML = "Time before slider automatically disappear  :";
        const inputTimeSlider = document.createElement('input');
        inputTimeSlider.type = "number";
        inputTimeSlider.id = "timeBeforeSliderDisappear" + numeroBetweenElement;
        inputTimeSlider.name = "padlock";
        inputTimeSlider.min = "1";
        inputTimeSlider.required = true;
        if (element.timeSlider) {
            inputTimeSlider.value = element.timeSlider;
        }
        //add comment
        const comment = document.createElement('span');
        comment.className = "commentText";
        comment.innerHTML = "  //time in ms";

        timeBeforeSliderDisappear.appendChild(inputTimeSlider);
        timeBeforeSliderDisappear.appendChild(comment);
        timeBeforeSliderDisappear.style.marginLeft = "20px";
        timeBeforeSliderDisappear.style.display = "none";


        //delete element option
        const deleteBetweenElement = document.createElement('i');
        deleteBetweenElement.className = "fa fa-trash";
        deleteBetweenElement.style = "cursor: pointer";
        deleteBetweenElement.addEventListener("click", () => {
            deleteBetweenElement.parentElement.remove();
            const elements = document.querySelectorAll(".BetweenElement");
            numeroBetweenElement = 1;
            elements.forEach(element => {
                element.id = "BetweenElement" + numeroBetweenElement;
                element.childNodes[0].nodeValue = "BetweenElement " + numeroBetweenElement + " ";
                numeroBetweenElement += 1;
            });
        });
        deleteBetweenElement.style.marginLeft = "20px";
        deleteBetweenElement.style.display = "none";

        currentDiv.appendChild(triangleDown);
        currentDiv.appendChild(nbLock);
        currentDiv.appendChild(nbSlidesToUnlock);
        currentDiv.appendChild(timeBeforeSliderDisappear);
        currentDiv.appendChild(deleteBetweenElement);


        const betweenElementList = document.getElementById("betweenElementList");
        betweenElementList.appendChild(currentDiv);

        numeroBetweenElement += 1;
    });

}

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

    //padLocks - slider settings
    var betweenElementSettings = [];
    betweenElements = document.querySelectorAll(".BetweenElement");
    if (betweenElements.length <= 0) {
        alert('Create at least one between element !');
        return;
    }
    betweenElements.forEach(element => {
        var inputBetweenElementList = element.getElementsByTagName("input");
        const nbLock = inputBetweenElementList[0].value;
        const nbSlides = inputBetweenElementList[1].value;
        const timeSlider = inputBetweenElementList[2].value;
        betweenElementSettings.push({ "nbLock": nbLock, "nbSlides": nbSlides, "timeSlider": timeSlider });
    });

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
    const displayTimeline = document.getElementById("displayTimeline").checked;
    const authorizeRetest = document.getElementById("authorizeRetest").checked;

    gameSettings.body = JSON.stringify({
        nbBlocksToDo: nbBlocksToDo,
        nbFormsByBlock: nbFormsByBlock,
        formsFrequence: formsFrequence,
        formList: formList,
        nbTargetToSelect: nbTargetToSelect,
        betweenElements: betweenElementSettings,
        displayTimeline: displayTimeline,
        authorizeRetest: authorizeRetest
    });

    const response = await fetch('/settings', gameSettings);
    const res = await response.json();
    console.log(res);
    setTimeout(() => { document.getElementById('indexRef').style.display = ''; }, 2000);
}