//test mobile or tablet
window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    //console.log('sur une tablette ' + check);
    return check;
};
//-----------------------------------------------------------------------------------
//                            GAME PARAMETERS
//-----------------------------------------------------------------------------------
var STEP = 8;
var NB_LOCKS = 3;
var NB_SLIDES = 4;
var TIME_SLIDER = 2000;
var formsList = ["Square", "Circle"];
var NB_TARGET_TO_SELECT = 4;
var nbBlocksToDo = 2;
var nbFormsByBlock = 4;
var blockFormFrequence = { 'Square': 2, 'Circle': 2 }; //blockList previously
var easyMode = true;
var displayTimeline = true;
var unlockDone = 0; //var saying how current target was unlocked
var currentUnlockTime = -1;

const VIBRATION_STEP = 8;
const learningState = { 'Square': 0, 'Circle': 0, 'Triangle': 0, 'Cross': 0 };
const initDate = new Date(Date.now());
var ipAdress = null;
$.getJSON("https://api.ipify.org?format=json", function(data) {
    ipAdress = data.ip;
});

//LAUNCH GAME
setGameParameters();

async function setGameParameters() {
    if (window.mobileAndTabletCheck()) return;
    else {
        document.getElementById("mobileRestriction").style.display = 'none';
    }
    fetch('/gameParameters')
        .then(response => response.json())
        .then(data => {
            const gameParameters = data[0];
            console.log(gameParameters);
            nbBlocksToDo = gameParameters.nbBlocksToDo;
            nbFormsByBlock = gameParameters.nbFormsByBlock;
            STEP = nbFormsByBlock * nbBlocksToDo;
            formsFrequence = gameParameters.formsFrequence;
            NB_LOCKS = gameParameters.nbLock;
            formsList = gameParameters.formList;
            NB_TARGET_TO_SELECT = gameParameters.nbTargetToSelect;
            NB_SLIDES = gameParameters.nbSlidesToUnlock;
            TIME_SLIDER = gameParameters.timeBeforeSliderDisappear;
            displayTimeline = gameParameters.displayTimeline;
            //update blockFormFrequence
            blockFormFrequence = {};
            shuffle(formsList);
            for (let i in formsFrequence) {
                blockFormFrequence[formsList[i]] = formsFrequence[i];
            }
            //here to drawBoard with only selectable form
            formsList = formsList.slice(0, formsFrequence.length);
            console.log('blockFormFrequence is ' + JSON.stringify(blockFormFrequence));
        })
        .catch(err => {
            console.log("erreur dans la mise en place des parametres");
            console.log(err);
        })
        /*.then(() => {
            Game();
        })*/
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

//useful for array sum
const reducer = (accumulator, currentValue) => accumulator + currentValue;

//--------------------------------------------------------------------------------
//                  GAME variables to post in the database
//--------------------------------------------------------------------------------
var formNameTimeline = [];
var listLockState = []; //unlock state link to the formTimeline
var nbTotalClick = 0;
var nbUsefulClick = 0;
var nbLockOpened = 0;
var listNbClick = [];
var listNbUnusefulClick = [];
var listDuration = [];
var listTryUnlock = [];
var listTimeToUnlock = [];
var listNbFormToSelect = [];
var listNbLockOpened = [];
var listOccurence = [];
var jsonOccurence = { 'Square': 1, 'Circle': 1, 'Triangle': 1, 'Cross': 1 };
var firstUnlockOccurence = { 'Square': -1, 'Circle': -1, 'Triangle': -1, 'Cross': -1 };
var firstUnlockTrial = { 'Square': -1, 'Circle': -1, 'Triangle': -1, 'Cross': -1 };
var lastUnlockOccurence = { 'Square': -1, 'Circle': -1, 'Triangle': -1, 'Cross': -1 };
var lastUnlockTrial = { 'Square': -1, 'Circle': -1, 'Triangle': -1, 'Cross': -1 };




function Game() {

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {}
    };

    const bodytemp = document.body
    bodytemp.addEventListener("mousedown", clickCount); //also

    function clickCount( /* mouse event*/ event) {
        nbTotalClick++;
    }

    async function endGamePOSTING() {
        //timestamp for the total duration
        const timestamp = Date.now();

        options.body = JSON.stringify({
            initDate: initDate,
            ipUser: ipAdress,
            nbTrials: STEP,
            lockSettings: NB_LOCKS,
            sliderTimeBeforeDisappear: TIME_SLIDER,
            nbFormsByBlock: nbFormsByBlock,
            formNameTimeline: formNameTimeline,
            listTryUnlock: listTryUnlock,
            listLockState: listLockState,
            listTimeToUnlock: listTimeToUnlock,
            listNbFormToSelect: listNbFormToSelect,
            blockFormFrequence: blockFormFrequence,
            listNbClick: listNbClick,
            listNbUnusefulClick: listNbUnusefulClick,
            listNbLockOpened: listNbLockOpened, //new
            firstUnlockOccurence: firstUnlockOccurence,
            firstUnlockTrial: firstUnlockTrial,
            lastUnlockOccurence: lastUnlockOccurence,
            lastUnlockTrial: lastUnlockTrial,
            listOccurence: listOccurence,
            listDuration: listDuration,
            totalDuration: timestamp - new Date(initDate).getTime()
        });
        const response = await fetch('/api', options);
        const data = await response.json();
        console.log(data);
    }
    //listNbUsefulClick: listNbUsefulClick,

    //------------------class------------------------------
    //probablement à transferer dans un autre fichier js quand on saura comment faire

    class Square {
        constructor(x, y, w, h, selectable, context = ctxFormsBoard) {
            this.w = w;
            this.h = h;
            this.bottom = y + h / 2;
            this.top = y - h / 2;
            this.right = x + w / 2;
            this.left = x - w / 2;
            this.highlight = false;
            this.selectable = selectable;
            this.selected = false;
            this.ctx = context; //necessary because of different canvas
            this.unlocked = false;
            this.vibrate = false;
            this.vibrateX = 0;
            this.vibrateAnimationStep = VIBRATION_STEP;
        }

        draw() {
            if (this.vibrate) {
                if (this.vibrateAnimationStep <= 0) {
                    this.vibrateAnimationStep = VIBRATION_STEP + 1; //cst shoulb be put
                    this.vibrate = false;
                    this.vibrateX = 0;
                } else if (this.vibrateAnimationStep <= VIBRATION_STEP / 4) {
                    this.vibrateX -= 2;
                } else if (this.vibrateAnimationStep <= 3 * VIBRATION_STEP / 4) {
                    this.vibrateX += 2;
                } else {
                    this.vibrateX -= 2
                }
                this.vibrateAnimationStep--;
            }
            if (this.selected || this.unlocked) {
                this.ctx.fillStyle = COLOR_SQUARE;
                this.ctx.fillRect(this.left - SELECT_MARGIN / 2, this.top - SELECT_MARGIN / 2, this.w + SELECT_MARGIN, this.h + SELECT_MARGIN);
                this.ctx.fillStyle = COLOR_SQUARE_LIT; //COLOR_SELECT;

            } else if (this.highlight) {
                this.ctx.fillStyle = COLOR_SQUARE_LIT;
            } else {
                this.ctx.fillStyle = COLOR_SQUARE;
            }
            this.ctx.fillRect(this.left + this.vibrateX, this.top, this.w, this.h);
        }

        contains(x, y) {
            //method wich return true if (x,y) inside of the square
            return x > this.left && x < this.right && y > this.top && y < this.bottom;
        }
    }

    class Cross {
        constructor(x, y, w, h, thickness, selectable, context = ctxFormsBoard) {
            this.w = w;
            this.h = h;
            this.bottom = y + h / 2; //
            this.top = y - h / 2; //      this part was added
            this.right = x + w / 2; //      for the easy mode
            this.left = x - w / 2; //
            this.thickness = thickness
            this.rect1x = x - thickness / 2;
            this.rect1y = y - h / 2;
            this.rect2x = x - w / 2;
            this.rect2y = y - thickness / 2;
            this.highlight = false;
            this.selectable = selectable;
            this.selected = false;
            this.ctx = context; //necessary because of different canvas
            this.unlocked = false;
            this.vibrate = false;
            this.vibrateX = 0;
            this.vibrateAnimationStep = VIBRATION_STEP;
        }

        draw() {
            if (this.vibrate) {
                if (this.vibrateAnimationStep <= 0) {
                    this.vibrateAnimationStep = VIBRATION_STEP + 1; //cst shoulb be put
                    this.vibrate = false;
                    this.vibrateX = 0;
                } else if (this.vibrateAnimationStep <= VIBRATION_STEP / 4) {
                    this.vibrateX -= 2;
                } else if (this.vibrateAnimationStep <= 3 * VIBRATION_STEP / 4) {
                    this.vibrateX += 2;
                } else {
                    this.vibrateX -= 2
                }
                this.vibrateAnimationStep--;
            }
            if (this.selected || this.unlocked) { // not done -------------------------------
                this.ctx.fillStyle = COLOR_CROSS
                this.ctx.fillRect(this.rect1x - SELECT_MARGIN / 2, this.rect1y - SELECT_MARGIN / 2, this.thickness + SELECT_MARGIN, this.h + SELECT_MARGIN);
                this.ctx.fillRect(this.rect2x - SELECT_MARGIN / 2, this.rect2y - SELECT_MARGIN / 2, this.w + SELECT_MARGIN, this.thickness + SELECT_MARGIN);
                this.ctx.fillStyle = COLOR_CROSS_LIT; //COLOR_SELECT;

            } else if (this.highlight) {
                this.ctx.fillStyle = COLOR_CROSS_LIT;
            } else {
                this.ctx.fillStyle = COLOR_CROSS;
            }
            this.ctx.fillRect(this.rect1x + this.vibrateX, this.rect1y, this.thickness, this.h);
            this.ctx.fillRect(this.rect2x + this.vibrateX, this.rect2y, this.w, this.thickness);
        }

        contains(x, y) {
            if (easyMode) {
                return x > this.left && x < this.right && y > this.top && y < this.bottom;
            } else {
                //method wich return true if (x,y) inside of the cross
                return x > this.rect1x && x < this.rect1x + this.thickness &&
                    y > this.rect1y && y < this.rect1y + this.h ||
                    x > this.rect2x && x < this.rect2x + this.w &&
                    y > this.rect2y && y < this.rect2y + this.thickness;
            }

        }
    }

    class Circle {
        constructor(x, y, radius, selectable, context = ctxFormsBoard) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.bottom = y + radius; //
            this.top = y - radius; //      this part was added
            this.right = x + radius; //      for the easy mode
            this.left = x - radius; //
            this.highlight = false;
            this.selectable = selectable;
            this.selected = false;
            this.ctx = context; //necessary because of different canvas
            this.unlocked = false;
            this.vibrate = false;
            this.vibrateX = 0;
            this.vibrateAnimationStep = VIBRATION_STEP;
        }

        draw() {
            if (this.vibrate) {
                if (this.vibrateAnimationStep <= 0) {
                    this.vibrateAnimationStep = VIBRATION_STEP + 1; //cst shoulb be put
                    this.vibrate = false;
                    this.vibrateX = 0;
                } else if (this.vibrateAnimationStep <= VIBRATION_STEP / 4) {
                    this.vibrateX -= 2;
                } else if (this.vibrateAnimationStep <= 3 * VIBRATION_STEP / 4) {
                    this.vibrateX += 2;
                } else {
                    this.vibrateX -= 2
                }
                this.vibrateAnimationStep--;
            }
            if (this.selected || this.unlocked) {
                this.ctx.fillStyle = COLOR_CIRCLE;
                this.ctx.beginPath();
                this.ctx.arc(this.x, this.y, this.radius + SELECT_MARGIN / 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = COLOR_CIRCLE_LIT; //COLOR_SELECT;
            } else if (this.highlight) {
                this.ctx.fillStyle = COLOR_CIRCLE_LIT;
            } else {
                this.ctx.fillStyle = COLOR_CIRCLE;
            }
            this.ctx.beginPath();
            this.ctx.arc(this.x + this.vibrateX, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        contains(x, y) {
            if (easyMode) {
                return x > this.left && x < this.right && y > this.top && y < this.bottom;
            } else {
                return Math.abs(x - this.x) < this.radius && Math.abs(this.y - y) < this.radius;
            }
        }
    }

    class Triangle {
        constructor(x, y, h, selectable, context = ctxFormsBoard) {
            this.x = x;
            this.y = y;
            this.h = h;
            this.bottom = y + h / 2; //
            this.top = y - h / 2; //      this part was added
            this.right = x + h / 2; //      for the easy mode
            this.left = x - h / 2; //
            this.highlight = false;
            this.selectable = selectable;
            this.selected = false;
            this.ctx = context; //necessary because of different canvas
            this.unlocked = false;
            this.unlocked = false;
            //coordinates
            this.t1 = { x: this.x - this.h / 2, y: this.y + this.h / 2 }; //left coin /_
            this.t2 = { x: this.x, y: this.y - this.h / 2 }; //top coin /\
            this.t3 = { x: this.x + this.h / 2, y: this.y + this.h / 2 }; //right coin _\
            //parameters of the segments - a*X+b
            this.a_t1_t2 = (this.t1.y - this.t2.y) / (this.t1.x - this.t2.x);
            this.b_t1_t2 = (this.t2.y - this.a_t1_t2 * this.t2.x);
            this.a_t2_t3 = (this.t2.y - this.t3.y) / (this.t2.x - this.t3.x);
            this.b_t2_t3 = (this.t3.y - this.a_t2_t3 * this.t3.x);
            this.vibrate = false;
            this.vibrateX = 0;
            this.vibrateAnimationStep = VIBRATION_STEP;

        }
        slope_t1_t2(x) {
            return this.a_t1_t2 * x + this.b_t1_t2;
        }
        slope_t2_t3(x) {
            return this.a_t2_t3 * x + this.b_t2_t3;
        }
        draw() {
            if (this.vibrate) {
                if (this.vibrateAnimationStep <= 0) {
                    this.vibrateAnimationStep = VIBRATION_STEP + 1; //cst shoulb be put
                    this.vibrate = false;
                    this.vibrateX = 0;
                } else if (this.vibrateAnimationStep <= VIBRATION_STEP / 4) {
                    this.vibrateX -= 2;
                } else if (this.vibrateAnimationStep <= 3 * VIBRATION_STEP / 4) {
                    this.vibrateX += 2;
                } else {
                    this.vibrateX -= 2
                }
                this.vibrateAnimationStep--;
            }
            if (this.selected || this.unlocked) {
                this.ctx.fillStyle = COLOR_TRIANGLE;
                this.ctx.beginPath();
                this.ctx.moveTo(this.t1.x - SELECT_MARGIN, this.t1.y + SELECT_MARGIN / 2);
                this.ctx.lineTo(this.t2.x, this.t2.y - SELECT_MARGIN);
                this.ctx.lineTo(this.t3.x + SELECT_MARGIN, this.t3.y + SELECT_MARGIN / 2);
                this.ctx.fill();
                this.ctx.fillStyle = COLOR_TRIANGLE_LIT; //COLOR_SELECT;

            } else if (this.highlight) {
                this.ctx.fillStyle = COLOR_TRIANGLE_LIT;
            } else {
                this.ctx.fillStyle = COLOR_TRIANGLE;
            }
            this.ctx.beginPath();
            this.ctx.moveTo(this.t1.x + this.vibrateX, this.t1.y);
            this.ctx.lineTo(this.t2.x + this.vibrateX, this.t2.y);
            this.ctx.lineTo(this.t3.x + this.vibrateX, this.t3.y);
            this.ctx.fill();
        }

        contains(x, y) {
            if (easyMode) {
                return x > this.left && x < this.right && y > this.top && y < this.bottom;
            } else {
                return x >= this.t1.x && x < this.t3.x &&
                    y > this.slope_t1_t2(x) && y > this.slope_t2_t3(x) &&
                    y <= this.t3.y;
            }
        }

    }

    class Indexer {
        //sqare in the timeline canvas showing the current form to select
        constructor(x, y, w, h, ctx = ctxTimeline) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.ctx = ctx;
        }

        draw() {
            this.ctx.strokeStyle = COLOR_INDEX;
            this.ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        }
    }

    class Button {
        constructor(x, y, w, h, radius, context) {
            this.w = w;
            this.h = h;
            this.bottom = y + h / 2;
            this.top = y - h / 2;
            this.right = x + w / 2;
            this.left = x - w / 2;
            this.radius = radius;
            this.highlight = false;
            //this.selectable = selectable;
            //this.selected = false;
            this.ctx = context; //necessary because of different canvas
        }

        draw() {
            if (this.highlight) {
                this.ctx.fillStyle = UNLOCK_BUTTON_COLOR_LIT;
            } else {
                this.ctx.fillStyle = UNLOCK_BUTTON_COLOR;
            }
            this.ctx.beginPath();
            this.ctx.strokeStyle = UNLOCK_BUTTON_COLOR_STROKE;
            this.ctx.lineWidth = "4";
            this.ctx.moveTo(this.left + this.radius, this.top);
            this.ctx.lineTo(this.right - this.radius, this.top);
            this.ctx.quadraticCurveTo(this.right, this.top, this.right, this.top + this.radius);
            this.ctx.lineTo(this.right, this.bottom - this.radius);
            this.ctx.quadraticCurveTo(this.right, this.bottom, this.right - this.radius, this.bottom);
            this.ctx.lineTo(this.left + this.radius, this.bottom);
            this.ctx.quadraticCurveTo(this.left, this.bottom, this.left, this.bottom - this.radius);
            this.ctx.lineTo(this.left, this.top + this.radius);
            this.ctx.quadraticCurveTo(this.left, this.top, this.left + this.radius, this.top);
            this.ctx.fill();
            this.ctx.stroke();
        }

        contains(x, y) {
            //method wich return true if (x,y) inside of the square
            return x > this.left && x < this.right && y > this.top && y < this.bottom;
        }
    }
    //-----------------------------end class-------------------------------------
    //###################################################################################



    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    //                        set up the timeline canvas 
    //----------------------errors----------------------------------------------------------
    //var STEP = 5;
    const MIN_SIZE = 20;
    const MIN_CIRCLE_RADIUS = MIN_SIZE / 4; //
    const MIN_SQUARE_SIZE = MIN_SIZE / 2; //      Same ratio
    const MIN_TRIANGLE_HEIGHT = MIN_SIZE / 2; //      as before
    const MIN_CROSS_THICKNESS = MIN_SIZE / 8; //
    const TL_MARGIN = 20; //Timeline margin to write step
    const INDEX_SIZE = MIN_SQUARE_SIZE + 3;
    const TL_HEIGHT = MIN_SIZE + 2 * TL_MARGIN; //timeline height
    const TL_WIDTH = MIN_SIZE * STEP; //timeline width

    const COLOR_FONT = "darkgrey";
    const COLOR_INDEX = "darkgrey";
    const COLOR_TIMELINEBOARD = "white";

    var canvTimeline = document.getElementById("timelineCanvas");
    canvTimeline.height = TL_HEIGHT;
    canvTimeline.width = TL_WIDTH;

    var currentStep = 0;

    //set up context
    var ctxTimeline = canvTimeline.getContext("2d");
    //index
    var indexStep = new Indexer(getTimelineGridX(0), getTimelineGridY(), INDEX_SIZE, INDEX_SIZE);

    var formTimeline = [];

    for (let i = 0; i < nbBlocksToDo; i++) {
        var formToAdd = JSON.parse(JSON.stringify(blockFormFrequence));

        for (let j = 0; j < nbFormsByBlock; j++) {
            var currentIndex = i * nbFormsByBlock + j;
            var currentForm = null;
            var tempFormSelected = Object.keys(formToAdd)[Math.floor(Math.random() * Object.keys(formToAdd).length)]
            formToAdd[tempFormSelected] -= 1;
            if (formToAdd[tempFormSelected] == 0) {
                delete formToAdd[tempFormSelected];
            }
            switch (tempFormSelected) {
                case "Square":
                    currentForm = new Square(getTimelineGridX(currentIndex), getTimelineGridY(), MIN_SQUARE_SIZE, MIN_SQUARE_SIZE, false, ctxTimeline);
                    break;
                case "Circle":
                    currentForm = new Circle(getTimelineGridX(currentIndex), getTimelineGridY(), MIN_CIRCLE_RADIUS, false, ctxTimeline);
                    break;
                case "Triangle":
                    currentForm = new Triangle(getTimelineGridX(currentIndex), getTimelineGridY(), MIN_TRIANGLE_HEIGHT, false, ctxTimeline);
                    break;
                case "Cross":
                    currentForm = new Cross(getTimelineGridX(currentIndex), getTimelineGridY(), MIN_SQUARE_SIZE, MIN_SQUARE_SIZE, MIN_CROSS_THICKNESS, false, ctxTimeline);
                    break;
                default:
                    console.log("Error while selecting forms for the timeline");
                    break;
            }
            formTimeline[currentIndex] = currentForm;
        }
    }


    var nameCurrentForm = formTimeline[0].constructor.name;

    //iniate formNameTimeline values
    for (i in formTimeline) {
        formNameTimeline[i] = String(formTimeline[i].constructor.name);
    }

    //-------------------------------- functions ---------------------------------

    function getTimelineGridX(col) {
        //to think about clarify this lines
        return MIN_SIZE * (col + 1 / 2);
    }

    function getTimelineGridY() {
        //only one line so no need for argument
        return TL_MARGIN + MIN_SIZE / 2 + 18; //18 is the size of the font
    }

    function drawStep() {
        ctxTimeline.fillStyle = COLOR_FONT;
        ctxTimeline.font = "bold 18px arial";
        ctxTimeline.fillText("Step " + (currentStep + 1) + "/" + STEP, 2, 23);
        if (displayTimeline) {
            for (let form of formTimeline) {
                form.draw();
            }
            indexStep.draw();
        }
    }

    function drawTimelineBoard() {
        ctxTimeline.fillStyle = COLOR_TIMELINEBOARD;
        //ctxTimeline.strokeStyle = COLOR_TIMELINEBOARDER;
        ctxTimeline.fillRect(0, 0, TL_WIDTH, TL_HEIGHT);
        //ctxTimeline.strokeRect(STROKE / 2, STROKE / 2, WIDTH - STROKE, HEIGHT - STROKE)
    }
    //-----------------------------------------------------------------------------------
    //                              set up formBoardCanvas
    //-------------------------------------------------------------------------------------
    //game parameters
    const FPS = 30; //frames per second
    const HEIGHT = 510;
    const WIDTH = 495;
    const GRID_SIZE = 4; //number of rows(and columns)

    const CELL = WIDTH / (GRID_SIZE + 2); //size of cells
    const STROKE = CELL / 12; //stroke width
    const CIRCLE_RADIUS = CELL / 4;
    const SQUARE_SIZE = CELL / 2;
    const TRIANGLE_HEIGHT = CELL / 2;
    const CROSS_THICKNESS = CELL / 8;
    const MARGIN = 3 / 2 * CELL; //HEIGHT - (GRID_SIZE + 1) * CELL; //top margin for scores
    const SELECT_MARGIN = CELL / 8;

    //colours
    const COLOR_BOARD = "gainsboro";
    const COLOR_BOARDER = "grey";
    const COLOR_SQUARE = "crimson";
    const COLOR_SQUARE_LIT = "lightpink";
    const COLOR_CROSS = "limegreen";
    const COLOR_CROSS_LIT = "lightgreen";
    const COLOR_CIRCLE = "royalblue";
    const COLOR_CIRCLE_LIT = "lightsteelblue";
    const COLOR_TRIANGLE = "darkorange";
    const COLOR_TRIANGLE_LIT = "#ffcc66";
    const COLOR_SELECT = "white";

    //set up game canvas 
    var canv = document.getElementById("formsBoardCanvas");
    canv.height = HEIGHT;
    canv.width = WIDTH;
    canv.style.top = String(TL_HEIGHT) + "px"; //set the top here because of canvasTiimeline changing size
    //document.body.appendChild(canv); //have to attach it to html (if created in js file)
    var canvBoundings = canv.getBoundingClientRect();

    //set up context
    var ctxFormsBoard = canv.getContext("2d");
    ctxFormsBoard.lineWidth = STROKE;


    //start a new game with tab of differents forms
    var boardInfos = newGame(formTimeline[0].constructor.name);
    var formsBoard = boardInfos.formsBoard;
    var nbFormToSelect = boardInfos.nbFormToSelect;
    var nbCurrentFormSelected = 0;

    //event handlers
    canv.addEventListener("mousemove", highlightForm); //add highlights just with mousemouve
    canv.addEventListener("mousedown", selectForm); //add highlights with mouse click

    //-----------------functions----------------
    function loop() {
        drawBoard();
        drawForms(formsBoard);
        drawTimelineBoard();
        drawStep();
        drawScore();
        drawTarget();
        drawLearning();
    }

    function drawBoard() {
        ctxFormsBoard.fillStyle = COLOR_BOARD;
        ctxFormsBoard.strokeStyle = COLOR_BOARDER;
        ctxFormsBoard.fillRect(0, 0, WIDTH, HEIGHT);
        ctxFormsBoard.strokeRect(STROKE / 2, STROKE / 2, WIDTH - STROKE, HEIGHT - STROKE);
    }

    function drawForms(formsBoard) {
        for (let row of formsBoard) {
            for (let form of row) {
                form.draw();
            }
        }
    }

    function getGridX(col) {
        //to think about clarify this lines
        return CELL * (col + 1) + CELL / 3; //the last part (cell/3 is a total magic number)
    }

    function getGridY(row) {
        return MARGIN + CELL * row;
    }

    function newGame(selectableForm) { //add number of each form or the proportion in the futur
        var prepareFormsBoard = [];
        var prepareFormsList = formsList.slice(0, formsList.indexOf(selectableForm)).concat(formsList.slice(formsList.indexOf(selectableForm) + 1));

        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (i * GRID_SIZE + j < NB_TARGET_TO_SELECT) {
                    prepareFormsBoard[i * GRID_SIZE + j] = selectableForm;
                } else {
                    prepareFormsBoard[i * GRID_SIZE + j] = prepareFormsList[Math.floor(Math.random() * prepareFormsList.length)];
                }
            }
        }
        shuffle(prepareFormsBoard);
        formsBoard = [];
        nbFormToSelect = 0;
        for (var i = 0; i < GRID_SIZE; i++) {
            formsBoard[i] = [];
            for (var j = 0; j < GRID_SIZE; j++) {
                switch (prepareFormsBoard[i * GRID_SIZE + j]) {
                    case "Square":
                        formsBoard[i][j] = new Square(getGridX(j), getGridY(i), SQUARE_SIZE, SQUARE_SIZE, selectableForm == "Square");
                        nbFormToSelect += selectableForm == "Square" ? 1 : 0;
                        break;
                    case "Circle":
                        formsBoard[i][j] = new Circle(getGridX(j), getGridY(i), CIRCLE_RADIUS, selectableForm == "Circle");
                        nbFormToSelect += selectableForm == "Circle" ? 1 : 0;
                        break;
                    case "Cross":
                        formsBoard[i][j] = new Cross(getGridX(j), getGridY(i), SQUARE_SIZE, SQUARE_SIZE, CROSS_THICKNESS, selectableForm == "Cross");
                        nbFormToSelect += selectableForm == "Cross" ? 1 : 0;
                        break;
                    case "Triangle":
                        formsBoard[i][j] = new Triangle(getGridX(j), getGridY(i), TRIANGLE_HEIGHT, selectableForm == "Triangle");
                        nbFormToSelect += selectableForm == "Triangle" ? 1 : 0;
                        break;
                    default:
                        console.log("Error while selecting forms for the timeline");
                        break;
                }
            }
        }
        listNbFormToSelect.push(nbFormToSelect);
        listLockState[currentStep] = learningState[nameCurrentForm];
        return { formsBoard: formsBoard, nbFormToSelect: nbFormToSelect };
    }

    function highlightForm( /* type MouseEvent*/ event) {
        //highlights forms inside the forms board canvas
        //get mouse position relative to the canvas
        let x = event.clientX - canvBoundings.left;
        let y = event.clientY - canvBoundings.top;
        //reset cursor
        document.body.style.cursor = "auto";
        //clear previous highlight
        for (let row of formsBoard) {
            for (let form of row) {
                form.highlight = false; //create this attribute
            }
        }

        //look for forms to highlight
        OUTER: for (let row of formsBoard) {
            for (let form of row) {
                if (form.contains(x, y) && !form.selected) {
                    form.highlight = true; //create this attribute !
                    document.body.style.cursor = "pointer";
                    break OUTER; //if one form is to highlight no need to look further
                }
            }
        }
    }

    function selectForm( /* type MouseEvent*/ event) {
        //get mouse position relative to the canvas
        let x = event.clientX - canvBoundings.left;
        let y = event.clientY - canvBoundings.top;

        //look for forms to select
        var selectAllUnlockForm = 'none';
        OUTER: for (let row of formsBoard) {
            for (let form of row) {
                if (form.contains(x, y) && !form.selected) {
                    if (!form.selectable) {
                        form.vibrate = true;
                    } else {
                        form.selected = true; //create this attribute !
                        nbCurrentFormSelected++;
                        nbUsefulClick++;
                        if (learningState[form.constructor.name] == NB_LOCKS) {
                            selectAllUnlockForm = form.constructor.name;
                        } else if (nbCurrentFormSelected >= nbFormToSelect) {
                            document.getElementById("nextButton").disabled = false;
                        }
                        break OUTER; //if one form is to highlight no need to look further
                    }
                }
            }
        }

        if (selectAllUnlockForm != 'none') {
            for (let row of formsBoard) {
                for (let form of row) {
                    if (form.constructor.name == selectAllUnlockForm && form.selectable && !form.selected) {
                        form.selected = true; //create this attribute !
                        nbCurrentFormSelected++;
                    }
                }

            }
            document.getElementById("nextButton").disabled = false;
        }
    }

    function gameUpdate() {
        //update Game Variable to save :
        listOccurence[currentStep] = jsonOccurence[nameCurrentForm];
        jsonOccurence[nameCurrentForm]++;
        listNbLockOpened[currentStep] = nbLockOpened;
        listTryUnlock[currentStep] = unlockDone;
        listTimeToUnlock[currentStep] = currentUnlockTime;
        listNbClick.push(listNbClick.length > 0 ? nbTotalClick - listNbClick.reduce(reducer) : nbTotalClick)
        listNbUnusefulClick.push(nbTotalClick - nbUsefulClick);
        if (nbTotalClick > nbUsefulClick) {
            nbUsefulClick = nbTotalClick;
        }
        var timestamp = Date.now();
        //start is initialise in chrono variables
        listDuration.push(timestamp - start); // new Date(timestamp - start)); 
        //--------------------------------------------------
        //update Game
        start = new Date(); //useful for chrono
        formTimeline[currentStep].highlight = true;
        currentStep++;
        currentScore += 10;
        unlockable = true; //to authorize to unlock again
        sliderable = true; //to authorize to slider again
        if (currentStep >= STEP) {
            console.log("END OF THE GAME");
            endGamePOSTING(); //post infos of the game
            document.getElementById("endGame").style.display = "flex";
            document.getElementById("scoreValue").innerHTML = currentScore;
            $.getScript('confetti.js', function() {
                BeginConfetti();
            });
            return;
        }
        //set current parameters
        nameCurrentForm = formTimeline[currentStep].constructor.name;
        indexStep.x = getTimelineGridX(currentStep);
        currentTarget = createTarget(nameCurrentForm)
        boardInfos = newGame(nameCurrentForm); //learningState[nameCurrentForm] == NB_LOCKS ? 'nothing to select' : nameCurrentForm);
        formsBoard = boardInfos.formsBoard;
        nbFormToSelect = boardInfos.nbFormToSelect;
        nbCurrentFormSelected = 0;
        nextButton.disabled = true;
        unlockDone = 0;
        currentUnlockTime = -1;
    }

    //------------------------------------------------------------------------------
    //                             scoreCanvas
    //------------------------------------------------------------------------------
    const SC_HEIGHT = 50;
    const SC_WIDTH = 160;
    const SCORE_COLOR_FONT = COLOR_BOARDER;

    var scoreCanvas = document.getElementById("scoreCanvas");
    scoreCanvas.height = SC_HEIGHT;
    scoreCanvas.width = SC_WIDTH;
    scoreCanvas.style.top = String(TL_HEIGHT) + "px";
    scoreCanvas.style.left = String(WIDTH + STROKE) + "px";

    //score value
    var currentScore = 0;

    //set up context
    var ctxScore = scoreCanvas.getContext("2d");
    ctxScore.lineWidth = STROKE;

    //--------------------------------  function ---------------------------------
    function drawScore() {
        //draw Score Board
        ctxScore.fillStyle = COLOR_BOARD;
        ctxScore.strokeStyle = COLOR_BOARDER;
        ctxScore.fillRect(0, 0, SC_WIDTH, SC_HEIGHT);
        ctxScore.strokeRect(STROKE / 2, STROKE / 2, SC_WIDTH - STROKE, SC_HEIGHT - STROKE);
        //draw the text
        ctxScore.fillStyle = SCORE_COLOR_FONT;
        ctxScore.font = "bold 18px arial";
        ctxScore.textAlign = "center";
        ctxScore.fillText("SCORE : " + currentScore, SC_WIDTH / 2, SC_HEIGHT / 2 + 7); //magic numbers ...
    }

    //------------------------------------------------------------------------------
    //                             targetCanvas
    //------------------------------------------------------------------------------

    const TC_HEIGHT = 160; //target canvas height
    const TC_WIDTH = 160; //target canvas width
    const TC_TOP_MARGIN = 50;
    const TC_CELL = 100;
    const TC_CIRCLE_RADIUS = TC_CELL / 4;
    const TC_SQUARE_SIZE = TC_CELL / 2;
    const TC_TRIANGLE_HEIGHT = TC_CELL / 2;
    const TC_CROSS_THICKNESS = TC_CELL / 8;
    const TARGET_COLOR_FONT = "red";
    const UNLOCK_X = TC_WIDTH / 2;
    const UNLOCK_Y = TC_HEIGHT - 30;
    const UNLOCK_W = 2 / 3 * TC_WIDTH;
    const UNLOCK_H = 33;
    const UNLOCK_RADIUS = 10;
    const UNLOCK_BUTTON_COLOR = "white";
    const UNLOCK_BUTTON_COLOR_LIT = "gray";
    const UNLOCK_BUTTON_COLOR_STROKE = "darkgrey";

    var targetCanvas = document.getElementById("targetCanvas");
    targetCanvas.height = TC_HEIGHT;
    targetCanvas.width = TC_WIDTH;
    targetCanvas.style.top = String(TL_HEIGHT + SC_HEIGHT + TC_TOP_MARGIN) + "px";
    targetCanvas.style.left = String(WIDTH + STROKE) + "px";
    var targetCanvasBoundings = targetCanvas.getBoundingClientRect();
    var targetSelectable = false; //authorize to clic on the target to unlock
    //chrono variables
    var start = new Date(); //begin the timer
    var end = 0;
    var diff = 0;
    var timer = "00:00";

    //set up context
    var ctxTarget = targetCanvas.getContext("2d");
    ctxTarget.lineWidth = STROKE;

    var currentTarget = createTarget(formTimeline[0].constructor.name);

    //to authorize only one unlock at the time
    var unlockable = true;
    //to authorize only one slider at the time
    var sliderable = true;
    //unlock button
    var unlockButton = new Button(UNLOCK_X, UNLOCK_Y, UNLOCK_W, UNLOCK_H, UNLOCK_RADIUS, ctxTarget);

    targetCanvas.addEventListener("mousemove", (event) => {
        highlightButton(event);
        highlightTarget(event);
    }); //add highlights just with mousemouve
    targetCanvas.addEventListener("mousedown", (event) => {
        unlocker(event);
        selectTarget(event);
    }); //add highlights with mouse click

    //--------------------------------  function ---------------------------------
    function highlightButton( /* type MouseEvent*/ event) {
        if (!unlockButton) return;
        //get mouse position relative to the canvas
        let x = event.clientX - targetCanvasBoundings.left;
        let y = event.clientY - targetCanvasBoundings.top;
        //reset cursor
        document.body.style.cursor = "auto";
        //clear previous highlight
        unlockButton.highlight = false; //create this attribute

        //look for forms to highlight
        if (unlockButton.contains(x, y)) {
            unlockButton.highlight = true; //create this attribute !
            document.body.style.cursor = "pointer";
        }
    }

    function unlocker( /* type MouseEvent*/ event) {
        if (!unlockButton) return;
        //get mouse position relative to the canvas
        let x = event.clientX - targetCanvasBoundings.left;
        let y = event.clientY - targetCanvasBoundings.top;
        if (unlockButton.contains(x, y) && nbCurrentFormSelected >= nbFormToSelect && learningState[nameCurrentForm] != NB_LOCKS) {
            nbUsefulClick++;
            unlockDone = 2;
            sliderDisplay();
            unlockButton = null;
        }
    }

    function sliderDisplay() {
        if (!sliderable) {
            return;
        } else {
            sliderable = false;
        }
        var startTimeSlider
        const slider = document.createElement('input');
        slider.id = 'slider';
        slider.type = 'range'
        slider.style.top = String(TL_HEIGHT + SC_HEIGHT + 2 * TC_TOP_MARGIN + TC_HEIGHT) + "px";
        slider.style.left = String(WIDTH + STROKE) + "px";
        slider.style.position = 'absolute';
        slider.style.width = String(TC_WIDTH - STROKE) + "px";
        slider.onclick = function() { nbUsefulClick++ };
        slider.onmouseover = function() { this.style.cursor = 'grab' };
        slider.onmousedown = function() {
            this.style.cursor = 'grabbing';
            startTimeSlider = Date.now();
        };
        slider.onmouseup = function() { this.style.cursor = 'grab' };
        var color;
        switch (nameCurrentForm) {
            case 'Square':
                color = COLOR_SQUARE;
                break;
            case 'Circle':
                color = COLOR_CIRCLE;
                break;
            case 'Triangle':
                color = COLOR_TRIANGLE;
                break;
            case 'Cross':
                color = COLOR_CROSS;
                break;
        }
        slider.style.background = color;
        var nbSlide = 0;
        var oldValue = 0;
        var slideDirection = 'right';
        slider.oninput = (slider = this) => {
            unlockDone = 3;
            //timer part
            if (Date.now() - startTimeSlider > TIME_SLIDER) {
                killSlider();
                unlock();
                return;
            }
            //action part
            var newValue = parseInt(slider['target'].value);
            if (slideDirection == 'right') {
                if (newValue >= oldValue) {
                    oldValue = newValue;
                } else {
                    oldValue = newValue;
                    slideDirection = 'left';
                    nbSlide++;
                }
            } else {
                if (newValue <= oldValue) {
                    oldValue = newValue;
                } else {
                    oldValue = newValue;
                    slideDirection = 'right';
                    nbSlide++;
                }
            }

            //unclock part
            if (nbSlide > NB_SLIDES) {
                unlock();
                killSlider();
            }
        }
        document.body.appendChild(slider);
    }

    function unlock() {
        if (!unlockable) return;
        if (learningState[nameCurrentForm] == NB_LOCKS) return;
        if (firstUnlockOccurence[nameCurrentForm] < 0) firstUnlockOccurence[nameCurrentForm] = jsonOccurence[nameCurrentForm];
        if (firstUnlockTrial[nameCurrentForm] < 0) firstUnlockTrial[nameCurrentForm] = currentStep + 1; //+1 'cause current step start from 0
        lastUnlockOccurence[nameCurrentForm] = jsonOccurence[nameCurrentForm];
        lastUnlockTrial[nameCurrentForm] = currentStep + 1;
        //next if is to test if learning state can improve
        if (learningState[nameCurrentForm] < NB_LOCKS) {
            learningState[nameCurrentForm] += 1;
            unlockable = false;
            unlockDone = 1; //for listTryUnlock
            var timestamp = Date.now();
            currentUnlockTime = (timestamp - start);
            nbUsefulClick++;
            nbLockOpened++;
        }
    }

    function killSlider() {
        try {
            document.getElementById('slider').remove();
        } catch {
            console.log('slider already killed');
        }
    }

    function drawTarget() {
        //draw Target Board
        ctxTarget.fillStyle = COLOR_BOARD;
        ctxTarget.strokeStyle = COLOR_BOARDER;
        ctxTarget.fillRect(0, 0, TC_WIDTH, TC_HEIGHT);
        ctxTarget.strokeRect(STROKE / 2, STROKE / 2, TC_WIDTH - STROKE, TC_HEIGHT - STROKE);
        //draw the target
        currentTarget.draw();
        //draw chronometer
        chronometer();
        ctxTarget.fillStyle = TARGET_COLOR_FONT;
        ctxTarget.font = "bold 24px arial";
        ctxTarget.textAlign = "center";
        ctxTarget.fillText(timer, TC_WIDTH / 2, 33);
        //draw unlock button
        if (unlockButton) unlockButton.draw();
        //draw unlock text
        ctxTarget.fillStyle = TARGET_COLOR_FONT;
        ctxTarget.font = "bold 18px arial";
        ctxTarget.textAlign = "center";
        var text = "UNLOCK";
        if (learningState[nameCurrentForm] == NB_LOCKS) text = "UNLOCKED";
        else if (!unlockButton) text = '';
        ctxTarget.fillText(text, TC_WIDTH / 2, UNLOCK_Y + 5);
    }

    function createTarget(currentTargetName) {
        //recreation du bouton si necessaire
        unlockButton = null;
        if (!(learningState[nameCurrentForm] == NB_LOCKS)) {
            unlockButton = new Button(UNLOCK_X, UNLOCK_Y, UNLOCK_W, UNLOCK_H, UNLOCK_RADIUS, ctxTarget);
        }
        //creation of the target form
        switch (currentTargetName) {
            case "Square":
                targetSelectable = learningState["Square"] == NB_LOCKS ? true : false;
                currentTarget = new Square(TC_WIDTH / 2, TC_HEIGHT / 2, TC_SQUARE_SIZE, TC_SQUARE_SIZE, targetSelectable, ctxTarget);
                break;
            case "Circle":
                targetSelectable = learningState["Circle"] == NB_LOCKS ? true : false;
                currentTarget = new Circle(TC_WIDTH / 2, TC_HEIGHT / 2, TC_CIRCLE_RADIUS, targetSelectable, ctxTarget);
                break;
            case "Triangle":
                targetSelectable = learningState["Triangle"] == NB_LOCKS ? true : false;
                currentTarget = new Triangle(TC_WIDTH / 2, TC_HEIGHT / 2, TC_TRIANGLE_HEIGHT, targetSelectable, ctxTarget);
                break;
            case "Cross":
                targetSelectable = learningState["Cross"] == NB_LOCKS ? true : false;
                currentTarget = new Cross(TC_WIDTH / 2, TC_HEIGHT / 2, TC_SQUARE_SIZE, TC_SQUARE_SIZE, TC_CROSS_THICKNESS, targetSelectable, ctxTarget);
                break;
            default:
                console.log("Error while selecting forms for the target");
                break;
        }
        return currentTarget;
    }

    function chronometer() {
        end = new Date();
        diff = end - start;
        diff = new Date(diff);
        var sec = diff.getSeconds();
        var min = diff.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        timer = min + ":" + sec;
        return timer;
    }

    function highlightTarget( /* type MouseEvent*/ event) {
        //highlights forms inside the forms board canvas
        //get mouse position relative to the canvas
        let x = event.clientX - targetCanvasBoundings.left;
        let y = event.clientY - targetCanvasBoundings.top;
        //reset cursor
        document.body.style.cursor = "auto";
        //clear previous highlight
        currentTarget.highlight = false; //create this attribute

        //look for forms to highlight
        if (currentTarget.contains(x, y) && !currentTarget.selected && currentTarget.selectable) {
            currentTarget.highlight = true; //create this attribute !
            document.body.style.cursor = "pointer";
        }
    }

    function selectTarget( /* type MouseEvent*/ event) {
        //get mouse position relative to the canvas
        let x = event.clientX - targetCanvasBoundings.left;
        let y = event.clientY - targetCanvasBoundings.top;

        //look for forms to select
        if (currentTarget.contains(x, y) && currentTarget.selectable && !currentTarget.selected) {
            currentTarget.selected = true; //create this attribute !
            nbUsefulClick++;
            for (let row of formsBoard) {
                for (let form of row) {
                    if (form.constructor.name == nameCurrentForm && form.selectable && !form.selected) {
                        form.selected = true; //create this attribute !
                        nbCurrentFormSelected++;
                    }
                }

            }
            document.getElementById("nextButton").disabled = false;
        }
    }

    //------------------------------------------------------------------------------
    //                             learningCanvas
    //------------------------------------------------------------------------------
    const LC_CELL = 70;
    //var NB_LOCKS = 3;
    const IMG_WIDTH = 4 * LC_CELL / 12;
    const IMG_HEIGHT = 5 * LC_CELL / 12;
    const IMG_MARGIN = LC_CELL / 2;
    const LC_MARGIN = LC_CELL; //tester differentes valeurs
    const LC_HEIGHT = LC_CELL * (formsList.length + 1) + LC_MARGIN / 2; //LearningCanvas Height
    const LC_WIDTH = 3 / 2 * LC_CELL + parseInt(NB_LOCKS) * (IMG_WIDTH + IMG_MARGIN / 3); //LearningCanvas Width


    const LC_CIRCLE_RADIUS = LC_CELL / 4;
    const LC_SQUARE_SIZE = LC_CELL / 2;
    const LC_TRIANGLE_HEIGHT = LC_CELL / 2;
    const LC_CROSS_THICKNESS = LC_CELL / 8;

    var learningCanvas = document.getElementById("learningCanvas");
    learningCanvas.height = LC_HEIGHT;
    learningCanvas.width = LC_WIDTH;
    learningCanvas.style.top = String(TL_HEIGHT) + "px";
    learningCanvas.style.left = String(WIDTH + STROKE + SC_WIDTH + STROKE) + "px";

    //load img
    var imgLock = new Image();
    imgLock.src = 'lock.png';
    var imgUnlock = new Image();
    imgUnlock.src = 'unlock.png';

    //set up context
    var ctxLearning = learningCanvas.getContext("2d");
    ctxLearning.lineWidth = STROKE;

    const learningForms = [];
    if (formsList.includes("Square")) {
        learningForms.push(new Square(getLearningGridX(), getLearningGridY(formsList.indexOf("Square")), LC_SQUARE_SIZE, LC_SQUARE_SIZE, false, ctxLearning));
    }
    if (formsList.includes("Circle")) {
        learningForms.push(new Circle(getLearningGridX(), getLearningGridY(formsList.indexOf("Circle")), LC_CIRCLE_RADIUS, false, ctxLearning));
    }
    if (formsList.includes("Triangle")) {
        learningForms.push(new Triangle(getLearningGridX(), getLearningGridY(formsList.indexOf("Triangle")), LC_TRIANGLE_HEIGHT, false, ctxLearning));
    }
    if (formsList.includes("Cross")) {
        learningForms.push(new Cross(getLearningGridX(), getLearningGridY(formsList.indexOf("Cross")), LC_SQUARE_SIZE, LC_SQUARE_SIZE, LC_CROSS_THICKNESS, false, ctxLearning));
    }

    //-----------------------------   function   -----------------------------------

    function getLearningGridX() {
        return 3 / 4 * LC_CELL;
    }

    function getLearningGridY(row) {
        return LC_MARGIN + CELL * row;
    }

    function getImgGridX(j) {
        return 3 / 2 * LC_CELL + j * IMG_MARGIN - IMG_WIDTH / 2;
    }

    function getImgGridY(row) {
        return LC_MARGIN + CELL * row - IMG_HEIGHT / 2;
    }

    function drawLearning() {
        //draw Learning Board
        ctxLearning.fillStyle = COLOR_BOARD;
        ctxLearning.strokeStyle = COLOR_BOARDER;
        ctxLearning.fillRect(0, 0, LC_WIDTH, LC_HEIGHT);
        ctxLearning.strokeRect(STROKE / 2, STROKE / 2, LC_WIDTH - STROKE, LC_HEIGHT - STROKE);
        //draw forms
        for (let form of learningForms) {
            form.draw();
        }
        drawLocks();
    }

    function drawLocks() {
        for (let i = 0; i < formsList.length; i++) {
            for (let j = 0; j < NB_LOCKS; j++) {
                if (learningState[formsList[i]] > j || learningState[formsList[i]] == NB_LOCKS) {
                    ctxLearning.drawImage(imgUnlock, getImgGridX(j), getImgGridY(i), IMG_WIDTH, IMG_HEIGHT);
                } else {
                    ctxLearning.drawImage(imgLock, getImgGridX(j), getImgGridY(i), IMG_WIDTH, IMG_HEIGHT);
                }
            }
        }
    }

    //------------------------------------------------------------------------------
    //                              Button
    //------------------------------------------------------------------------------

    var nextButton = document.getElementById("nextButton");
    //find a better way to choose the position of the nextButton
    nextButton.style.display = '';
    nextButton.style.top = String(TL_HEIGHT + HEIGHT - nextButton.height) + "px;";
    nextButton.style.margin = String(WIDTH + STROKE) + "px";
    nextButton.disabled = true;

    //--------------------    function   -------------------------------------------
    nextButton.onclick = function() {

        if (nbCurrentFormSelected >= nbFormToSelect) {
            nbUsefulClick++;
            gameUpdate();
            killSlider();
        }
    }

    //------------------------------------------------------------------------------
    //                              game update
    //------------------------------------------------------------------------------
    //set up the game loop
    //method repeats a given function at every given time-interval
    setInterval(loop, 1000 / FPS);

}