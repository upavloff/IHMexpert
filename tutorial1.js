//-----------------------------------------------------------------------------------
//                            GAME PARAMETERS
//-----------------------------------------------------------------------------------
var STEP = 3;
var NB_LOCKS = 1;
var NB_SLIDES = 4;
var TIME_SLIDER = 2000;
var formsList = ["Square", "Circle", "Triangle"];
var NB_TARGET_TO_SELECT = 3;
var BETWEEN_ELEMENT_INDEX = 0;
var nbBlocksToDo = 1;
var nbFormsByBlock = 3;
var blockFormFrequence = { 'Circle': 3 };
var easyMode = true;
var displayTimeline = true;
var unlockDone = 0; //var saying how current target was unlocked
var currentUnlockTime = -1;

const VIBRATION_STEP = 8;
const learningState = { 'Square': 0, 'Circle': 0, 'Triangle': 0, 'Cross': 0 };
const initDate = new Date(Date.now());

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

function GameTuto1() {

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
    const TL_WIDTH = 2 * MIN_SIZE * STEP; //timeline width

    const COLOR_FONT = "darkgrey";
    const COLOR_INDEX = "darkgrey";
    const COLOR_TIMELINEBOARD = "whitesmoke";

    var canvTimeline = document.getElementById("timelineCanvasTuto1");
    canvTimeline.height = TL_HEIGHT;
    canvTimeline.width = TL_WIDTH;
    //canvTimeline.style.marginTop = "100 px;";

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
            switch ("Circle") {
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
    const HEIGHT = 382;
    const WIDTH = 371;
    const GRID_SIZE = 3; //number of rows(and columns)

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
    var canv = document.getElementById("formsBoardCanvasTuto1");
    canv.height = HEIGHT;
    canv.width = WIDTH;
    canv.style.marginTop = String(TL_HEIGHT) + "px"; //set the top here because of canvasTiimeline changing size
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
        //drawScore();
        drawTarget();
        //drawLearning();
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
        return { formsBoard: formsBoard, nbFormToSelect: nbFormToSelect };
    }

    function highlightForm( /* type MouseEvent*/ event) {
        //highlights forms inside the forms board canvas
        //get mouse position relative to the canvas
        let x = event.offsetX;
        let y = event.offsetY;
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
        let x = event.offsetX;
        let y = event.offsetY;

        //look for forms to select
        var selectAllUnlockForm = 'none';
        OUTER: for (let row of formsBoard) {
            for (let form of row) {
                if (form.contains(x, y) && !form.selected) {
                    if (!form.selectable) {
                        form.vibrate = true;
                    } else {
                        form.selected = true;
                        nbCurrentFormSelected++;
                        document.getElementById("tuto1step1").style.color = "#4CAF50";
                        if (learningState[form.constructor.name] == NB_LOCKS) {
                            selectAllUnlockForm = form.constructor.name;
                        } else if (nbCurrentFormSelected >= nbFormToSelect) {
                            document.getElementById("nextButtonTuto1").disabled = false;
                            document.getElementById("tuto1step2").style.color = "#4CAF50";
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
            document.getElementById("nextButtonTuto1").disabled = false;
        }
    }

    function gameUpdate() {
        //update Game Variable to save :
        //update Game
        start = new Date(); //useful for chrono
        formTimeline[currentStep].highlight = true;
        currentStep++;
        //currentScore += 10;
        unlockable = true; //to authorize to unlock again
        sliderable = true; //to authorize to slider again
        if (currentStep >= STEP) {
            console.log("END OF THE GAME");
            document.getElementById("boardTuto1").style.display = 'none';
            document.getElementById("buttonToTuto2").style.display = '';

            document.getElementById("tuto1step4").style.color = "#4CAF50";

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
    /*
        //------------------------------------------------------------------------------
        //                             scoreCanvas
        //------------------------------------------------------------------------------
    */
    const SC_HEIGHT = 0;
    const SC_WIDTH = 160;
    /*    const SCORE_COLOR_FONT = COLOR_BOARDER;

        var scoreCanvas = document.getElementById("scoreCanvas");
        scoreCanvas.height = SC_HEIGHT;
        scoreCanvas.width = SC_WIDTH;
        //scoreCanvas.style.top = String(TL_HEIGHT) + "px";
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
    */
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

    var targetCanvas = document.getElementById("targetCanvasTuto1");
    targetCanvas.height = TC_HEIGHT;
    targetCanvas.width = TC_WIDTH;
    targetCanvas.style.marginTop = String(TL_HEIGHT + SC_HEIGHT + TC_TOP_MARGIN) + "px";
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
    var sliderDisplaySpan;

    //condition to kill slider
    var timerComplete = false;
    var nbSlideComplete = false;

    //to authorize only one unlock at the time
    var unlockable = true;
    //to authorize only one slider at the time
    var sliderable = true;
    //unlock button
    var unlockButton = new Button(UNLOCK_X, UNLOCK_Y, UNLOCK_W, UNLOCK_H, UNLOCK_RADIUS, ctxTarget);

    targetCanvas.addEventListener("mousemove", (event) => {
        highlightTarget(event);
        highlightButton(event);
    }); //add highlights just with mousemouve
    targetCanvas.addEventListener("mousedown", (event) => {
        unlocker(event);
        selectTarget(event);
    }); //add highlights with mouse click

    //--------------------------------  function ---------------------------------
    function highlightButton( /* type MouseEvent*/ event) {
        if (!unlockButton) return;
        //get mouse position relative to the canvas
        let x = event.offsetX;
        let y = event.offsetY;
        //reset cursor done by highlightTarget()

        //clear previous highlight
        unlockButton.highlight = false;

        //look for forms to highlight
        if (unlockButton.contains(x, y)) {
            if (nbCurrentFormSelected >= nbFormToSelect) {
                unlockButton.highlight = true;
                document.body.style.cursor = "pointer";
            } else {
                document.body.style.cursor = "not-allowed";
            }

        }
    }

    function unlocker( /* type MouseEvent*/ event) {
        if (!unlockButton) return;
        //get mouse position relative to the canvas
        let x = event.offsetX;
        let y = event.offsetY;
        if (unlockButton.contains(x, y) && nbCurrentFormSelected >= nbFormToSelect && learningState[nameCurrentForm] != NB_LOCKS) {
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
        sliderDisplaySpan = Date.now();
        var startTimeSlider;
        const slider = document.createElement('input');
        slider.id = 'slider';
        slider.type = 'range'
        slider.style.marginTop = String(TL_HEIGHT + SC_HEIGHT + 2 * TC_TOP_MARGIN + TC_HEIGHT) + "px";
        slider.style.left = String(WIDTH + STROKE) + "px";
        slider.style.position = 'absolute';
        slider.style.width = String(TC_WIDTH - STROKE) + "px";
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
                timerComplete = true;
                unlock();
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
                nbSlideComplete = true;
                unlock();
            }
        }
        document.body.appendChild(slider);
    }

    function unlock() {
        if (!(timerComplete && nbSlideComplete)) {
            return
        }
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
            nbLockOpened++;
        }
        sliderDisplaySpan = Date.now() - sliderDisplaySpan;
        killSlider();
        timerComplete = false;
        nbSlideComplete = false;
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
        // ctxTarget.fillText(timer, TC_WIDTH / 2, 33);
        //draw unlock button
        unlockButton = false;
        if (unlockButton) unlockButton.draw();
        //draw unlock text
        ctxTarget.fillStyle = TARGET_COLOR_FONT;
        ctxTarget.font = "bold 18px arial";
        ctxTarget.textAlign = "center";
        var text = "UNLOCK";
        //if (learningState[nameCurrentForm] == NB_LOCKS) text = "UNLOCKED";
        if (true) text = "TARGET";
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
        let x = event.offsetX;
        let y = event.offsetY;
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
        let x = event.offsetX;
        let y = event.offsetY;

        //look for forms to select
        if (currentTarget.contains(x, y) && currentTarget.selectable && !currentTarget.selected) {
            currentTarget.selected = true; //create this attribute !
            for (let row of formsBoard) {
                for (let form of row) {
                    if (form.constructor.name == nameCurrentForm && form.selectable && !form.selected) {
                        form.selected = true; //create this attribute !
                        nbCurrentFormSelected++;
                    }
                }

            }
            document.getElementById("nextButtonTuto1").disabled = false;
        }
    }

    //------------------------------------------------------------------------------
    //                             learningCanvas
    //------------------------------------------------------------------------------
    /*
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
    learningCanvas.style.marginTop = String(TL_HEIGHT) + "px";
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
*/
    //------------------------------------------------------------------------------
    //                              Button
    //------------------------------------------------------------------------------

    var nextButton = document.getElementById("nextButtonTuto1");
    //find a better way to choose the position of the nextButton
    nextButton.style.display = '';
    //nextButton.style.marginTop = String(TL_HEIGHT + HEIGHT - nextButton.height) + "px;";
    nextButton.style.marginLeft = String(WIDTH + STROKE) + "px";
    nextButton.style.marginTop = String(WIDTH + STROKE) + "px";;
    nextButton.disabled = true;

    //--------------------    function   -------------------------------------------
    nextButton.onclick = function() {

        if (nbCurrentFormSelected >= nbFormToSelect) {
            gameUpdate();
            document.getElementById("tuto1step3").style.color = "#4CAF50";
        }
    }

    //------------------------------------------------------------------------------
    //                              game update
    //------------------------------------------------------------------------------
    //set up the game loop
    //method repeats a given function at every given time-interval
    setInterval(loop, 1000 / FPS);

}