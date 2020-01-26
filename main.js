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
    }

    draw() {
        if (this.selected) {
            this.ctx.fillStyle = COLOR_SQUARE;
            this.ctx.fillRect(this.left - SELECT_MARGIN / 2, this.top - SELECT_MARGIN / 2, this.w + SELECT_MARGIN, this.h + SELECT_MARGIN);
            this.ctx.fillStyle = COLOR_SQUARE_LIT; //COLOR_SELECT;

        } else if (this.highlight) {
            this.ctx.fillStyle = COLOR_SQUARE_LIT;
        } else {
            this.ctx.fillStyle = COLOR_SQUARE;
        }
        this.ctx.fillRect(this.left, this.top, this.w, this.h);
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
        this.thickness = thickness
        this.rect1x = x - thickness / 2;
        this.rect1y = y - h / 2;
        this.rect2x = x - w / 2;
        this.rect2y = y - thickness / 2;
        this.highlight = false;
        this.selectable = selectable;
        this.selected = false;
        this.ctx = context; //necessary because of different canvas

    }

    draw() {
        if (this.selected) { // not done -------------------------------
            this.ctx.fillStyle = COLOR_CROSS
            this.ctx.fillRect(this.rect1x - SELECT_MARGIN / 2, this.rect1y - SELECT_MARGIN / 2, this.thickness + SELECT_MARGIN, this.h + SELECT_MARGIN);
            this.ctx.fillRect(this.rect2x - SELECT_MARGIN / 2, this.rect2y - SELECT_MARGIN / 2, this.w + SELECT_MARGIN, this.thickness + SELECT_MARGIN);
            this.ctx.fillStyle = COLOR_CROSS_LIT; //COLOR_SELECT;

        } else if (this.highlight) {
            this.ctx.fillStyle = COLOR_CROSS_LIT;
        } else {
            this.ctx.fillStyle = COLOR_CROSS;
        }
        this.ctx.fillRect(this.rect1x, this.rect1y, this.thickness, this.h);
        this.ctx.fillRect(this.rect2x, this.rect2y, this.w, this.thickness);
    }

    contains(x, y) {
        //method wich return true if (x,y) inside of the cross
        return x > this.rect1x && x < this.rect1x + this.thickness &&
            y > this.rect1y && y < this.rect1y + this.h ||
            x > this.rect2x && x < this.rect2x + this.w &&
            y > this.rect2y && y < this.rect2y + this.thickness;
    }
}

class Circle {
    constructor(x, y, radius, selectable, context = ctxFormsBoard) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.highlight = false;
        this.selectable = selectable;
        this.selected = false;
        this.ctx = context; //necessary because of different canvas

    }

    draw() {
        if (this.selected) {
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
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    contains(x, y) {
        return Math.abs(x - this.x) < this.radius && Math.abs(this.y - y) < this.radius;
    }
}

class Triangle {
    constructor(x, y, h, selectable, context = ctxFormsBoard) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.highlight = false;
        this.selectable = selectable;
        this.selected = false;
        this.ctx = context; //necessary because of different canvas

        //coordinates
        this.t1 = { x: this.x - this.h / 2, y: this.y + this.h / 2 }; //left coin /_
        this.t2 = { x: this.x, y: this.y - this.h / 2 }; //top coin /\
        this.t3 = { x: this.x + this.h / 2, y: this.y + this.h / 2 }; //right coin _\
        //parameters of the segments - a*X+b
        this.a_t1_t2 = (this.t1.y - this.t2.y) / (this.t1.x - this.t2.x);
        this.b_t1_t2 = (this.t2.y - this.a_t1_t2 * this.t2.x);
        this.a_t2_t3 = (this.t2.y - this.t3.y) / (this.t2.x - this.t3.x);
        this.b_t2_t3 = (this.t3.y - this.a_t2_t3 * this.t3.x);

    }
    slope_t1_t2(x) {
        return this.a_t1_t2 * x + this.b_t1_t2;
    }
    slope_t2_t3(x) {
        return this.a_t2_t3 * x + this.b_t2_t3;
    }
    draw() {
        if (this.selected) {
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
        this.ctx.moveTo(this.t1.x, this.t1.y);
        this.ctx.lineTo(this.t2.x, this.t2.y);
        this.ctx.lineTo(this.t3.x, this.t3.y);
        this.ctx.fill();
    }

    contains(x, y) {
        return x >= this.t1.x && x < this.t3.x &&
            y > this.slope_t1_t2(x) && y > this.slope_t2_t3(x) &&
            y <= this.t3.y;
    }
}

class Indexer {
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

//-----------------------------end class-------------------------------------
//###################################################################################


//-----------------------------------------------------------------------------------
//                            GAME PARAMETERS
//-----------------------------------------------------------------------------------

var formsList = ["Square", "Circle", "Triangle", "Cross"];

//--------------------------------------------------------------------------------
//                        set up the timeline canvas 
//--------------------------------------------------------------------------------
const STEP = 20;
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
for (let i = 0; i < STEP; i++) {
    currentForm = null;
    switch (formsList[Math.floor(Math.random() * formsList.length)]) {
        case "Square":
            currentForm = new Square(getTimelineGridX(i), getTimelineGridY(), MIN_SQUARE_SIZE, MIN_SQUARE_SIZE, false, ctxTimeline);
            break;
        case "Circle":
            currentForm = new Circle(getTimelineGridX(i), getTimelineGridY(), MIN_CIRCLE_RADIUS, false, ctxTimeline);
            break;
        case "Triangle":
            currentForm = new Triangle(getTimelineGridX(i), getTimelineGridY(), MIN_TRIANGLE_HEIGHT, false, ctxTimeline);
            break;
        case "Cross":
            currentForm = new Cross(getTimelineGridX(i), getTimelineGridY(), MIN_SQUARE_SIZE, MIN_SQUARE_SIZE, MIN_CROSS_THICKNESS, false, ctxTimeline);
            break;
        default:
            console.log("Error while selecting forms for the timeline");
            break;
    }

    formTimeline[i] = currentForm;
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
    for (let form of formTimeline) {
        form.draw();
    }
    indexStep.draw();
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
const GRID_SIZE = 5; //number of rows(and columns)

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


//set up the game loop
//method repeats a given function at every given time-interval
setInterval(loop, 1000 / FPS);

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
    formsBoard = [];
    nbFormToSelect = 0;
    for (i = 0; i < GRID_SIZE; i++) {
        formsBoard[i] = [];
        for (j = 0; j < GRID_SIZE; j++) {
            alea = Math.random();
            if (alea < 1 / 4) {
                formsBoard[i][j] = new Square(getGridX(j), getGridY(i), SQUARE_SIZE, SQUARE_SIZE, selectableForm == "Square");
                nbFormToSelect += selectableForm == "Square" ? 1 : 0;
            } else if (alea < 2 / 4) {
                formsBoard[i][j] = new Circle(getGridX(j), getGridY(i), CIRCLE_RADIUS, selectableForm == "Circle");
                nbFormToSelect += selectableForm == "Circle" ? 1 : 0;
            } else if (alea < 3 / 4) {
                formsBoard[i][j] = new Cross(getGridX(j), getGridY(i), SQUARE_SIZE, SQUARE_SIZE, CROSS_THICKNESS, selectableForm == "Cross");
                nbFormToSelect += selectableForm == "Cross" ? 1 : 0;
            } else {
                formsBoard[i][j] = new Triangle(getGridX(j), getGridY(i), TRIANGLE_HEIGHT, selectableForm == "Triangle");
                nbFormToSelect += selectableForm == "Triangle" ? 1 : 0;
            }
        }
    }
    return { formsBoard: formsBoard, nbFormToSelect: nbFormToSelect };
}

function highlightForm( /* type MouseEvent*/ event) {
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

    //look for forms to highlight
    OUTER: for (let row of formsBoard) {
        for (let form of row) {
            if (form.contains(x, y) && form.selectable && !form.selected) {
                form.selected = true; //create this attribute !
                nbCurrentFormSelected++;
                break OUTER; //if one form is to highlight no need to look further
            }
        }
    }
}

function gameUpdate() {
    formTimeline[currentStep].highlight = true;
    currentStep++;
    currentScore += 10;
    if (currentStep >= STEP) {
        console.log("END OF THE GAME");
        return;
    }
    indexStep.x = getTimelineGridX(currentStep);
    currentTarget = createTarget(formTimeline[currentStep].constructor.name)
    boardInfos = newGame(formTimeline[currentStep].constructor.name);
    formsBoard = boardInfos.formsBoard;
    nbFormToSelect = boardInfos.nbFormToSelect;
    nbCurrentFormSelected = 0;
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
    ctxScore.fillText("SCORE : " + currentScore, 20, SC_HEIGHT / 2 + 9); //magic numbers ...

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

var targetCanvas = document.getElementById("targetCanvas");
targetCanvas.height = TC_HEIGHT;
targetCanvas.width = TC_WIDTH;
targetCanvas.style.top = String(TL_HEIGHT + SC_HEIGHT + TC_TOP_MARGIN) + "px";
targetCanvas.style.left = String(WIDTH + STROKE) + "px";

//set up context
var ctxTarget = targetCanvas.getContext("2d");
ctxTarget.lineWidth = STROKE;

var currentTarget = createTarget(formTimeline[0].constructor.name);


//--------------------------------  function ---------------------------------
function drawTarget() {
    //draw Target Board
    ctxTarget.fillStyle = COLOR_BOARD;
    ctxTarget.strokeStyle = COLOR_BOARDER;
    ctxTarget.fillRect(0, 0, TC_WIDTH, TC_HEIGHT);
    ctxTarget.strokeRect(STROKE / 2, STROKE / 2, TC_WIDTH - STROKE, TC_HEIGHT - STROKE);
    //draw the target
    currentTarget.draw()
}

function createTarget(currentTargetName) {
    switch (currentTargetName) {
        case "Square":
            currentTarget = new Square(TC_WIDTH / 2, TC_HEIGHT / 2, TC_SQUARE_SIZE, TC_SQUARE_SIZE, false, ctxTarget);
            break;
        case "Circle":
            currentTarget = new Circle(TC_WIDTH / 2, TC_HEIGHT / 2, TC_CIRCLE_RADIUS, false, ctxTarget);
            break;
        case "Triangle":
            currentTarget = new Triangle(TC_WIDTH / 2, TC_HEIGHT / 2, TC_TRIANGLE_HEIGHT, false, ctxTarget);
            break;
        case "Cross":
            currentTarget = new Cross(TC_WIDTH / 2, TC_HEIGHT / 2, TC_SQUARE_SIZE, TC_SQUARE_SIZE, TC_CROSS_THICKNESS, false, ctxTarget);
            break;
        default:
            console.log("Error while selecting forms for the target");
            break;
    }
    return currentTarget
}



//------------------------------------------------------------------------------
//                             learningCanvas
//------------------------------------------------------------------------------
const LC_CELL = 70;
const LC_MARGIN = LC_CELL; //tester differentes valeurs
const LC_HEIGHT = LC_CELL * (formsList.length + 1); //LearningCanvas Height
const LC_WIDTH = 3 * LC_CELL; //LearningCanvas Width
const LC_CIRCLE_RADIUS = LC_CELL / 4;
const LC_SQUARE_SIZE = LC_CELL / 2;
const LC_TRIANGLE_HEIGHT = LC_CELL / 2;
const LC_CROSS_THICKNESS = LC_CELL / 8;

var learningCanvas = document.getElementById("learningCanvas");
learningCanvas.height = LC_HEIGHT;
learningCanvas.width = LC_WIDTH;
learningCanvas.style.top = String(TL_HEIGHT) + "px";
learningCanvas.style.left = String(WIDTH + STROKE + SC_WIDTH + STROKE) + "px";

//set up context
var ctxLearning = learningCanvas.getContext("2d");
ctxLearning.lineWidth = STROKE;

const learningForms = [
    new Square(getLearningGridX(), getLearningGridY(0), LC_SQUARE_SIZE, LC_SQUARE_SIZE, false, ctxLearning),
    new Circle(getLearningGridX(), getLearningGridY(1), LC_CIRCLE_RADIUS, false, ctxLearning),
    new Triangle(getLearningGridX(), getLearningGridY(2), LC_TRIANGLE_HEIGHT, false, ctxLearning),
    new Cross(getLearningGridX(), getLearningGridY(3), LC_SQUARE_SIZE, LC_SQUARE_SIZE, LC_CROSS_THICKNESS, false, ctxLearning)
];

//-----------------------------   function   -----------------------------------

function getLearningGridX() {
    return LC_CELL;
}

function getLearningGridY(row) {
    return LC_MARGIN + CELL * row;
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
}

//------------------------------------------------------------------------------
//                              Button
//------------------------------------------------------------------------------

var button = document.getElementById("nextButton");
//find a better way to choose the position of the button
button.style.top = String(TL_HEIGHT + HEIGHT - button.height) + "px;";
button.style.margin = String(WIDTH + STROKE) + "px";

//--------------------    function   -------------------------------------------
button.onclick = function() {
    if (nbCurrentFormSelected >= nbFormToSelect) {
        gameUpdate();
    }
}


//------------------------------------------------------------------------------
//                              Animation
//------------------------------------------------------------------------------