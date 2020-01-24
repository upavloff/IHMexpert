//------------------class------------------------------
//probablement à transferer dans un autre fichier js quand on saura comment faire

class Square {
    constructor(x, y, w, h) {
        this.w = w;
        this.h = h;
        this.bottom = y + h / 2;
        this.top = y - h / 2;
        this.right = x + w / 2;
        this.left = x - w / 2;
        this.highlight = false;
    }

    draw() {
        if (this.highlight) {
            ctx.fillStyle = COLOR_SQUARE_LIT;
        } else {
            ctx.fillStyle = COLOR_SQUARE;
        }
        ctx.fillRect(this.left, this.top, this.w, this.h);
    }

    contains(x, y) {
        //method wich return true if (x,y) inside of the square
        return x > this.left && x < this.right && y > this.top && y < this.bottom;
    }
}

class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CIRCLE_RADIUS;
        this.highlight = false;
    }

    draw() {
        if (this.highlight) {
            ctx.fillStyle = COLOR_CIRCLE_LIT;
        } else {
            ctx.fillStyle = COLOR_CIRCLE;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    contains(x, y) {
        return Math.abs(x - this.x) < this.radius && Math.abs(this.y - y) < this.radius;
    }
}

class Triangle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.h = TRIANGLE_HEIGHT;
        this.highlight = false;
    }

    draw() {
        if (this.highlight) {
            ctx.fillStyle = COLOR_TRIANGLE_LIT;
        } else {
            ctx.fillStyle = COLOR_TRIANGLE;
        }
        ctx.beginPath();
        ctx.moveTo(this.x - this.h / 2, this.y + this.h / 2);
        ctx.lineTo(this.x, this.y - this.h / 2)
        ctx.lineTo(this.x + this.h / 2, this.y + this.h / 2)
        ctx.fill();
    }

    contains(x, y) {
        //change it
        return false;
    }
}

//-----------------------------end class-------------------------------------

//game parameters
const FPS = 30; //frames per second
const HEIGHT = 550;
const WIDTH = HEIGHT * 0.9;
const GRID_SIZE = 5; //number of rows(and columns)

const CELL = WIDTH / (GRID_SIZE + 2); //size of cells
const STROKE = CELL / 12; //stroke width
const CIRCLE_RADIUS = CELL / 4;
const SQUARE_SIZE = CELL / 2;
const TRIANGLE_HEIGHT = CELL / 2;
const MARGIN = HEIGHT - (GRID_SIZE + 1) * CELL; //top margin for scores

//colours
const COLOR_BOARD = "gainsboro";
const COLOR_BOARDER = "grey";
const COLOR_SQUARE = "crimson";
const COLOR_SQUARE_LIT = "lightpink";
const COLOR_CIRCLE = "royalblue";
const COLOR_CIRCLE_LIT = "lightsteelblue";
const COLOR_TRIANGLE = "darkorange";
const COLOR_TRIANGLE_LIT = "lightsalmon";

//set up game canvas 
var canv = document.createElement("canvas");
canv.height = HEIGHT;
canv.width = WIDTH;
document.body.appendChild(canv); //have to attach it to html
var canvBoundings = canv.getBoundingClientRect();

//set up context
var ctx = canv.getContext("2d");
ctx.lineWidth = STROKE;

//game variables  //maybe put the numbers of each
//var squares;
//var circle;
//var triangles;

//start a new game with tab of differents forms
var forms = newGame();

//event handlers
canv.addEventListener("mousemove", highlightsForms); //add highlights even with just mousemouve


//set up the game loop
setInterval(loop, 1000 / FPS);

//-----------------functions----------------
function loop() {
    drawBoard();
    drawForms(forms);
}

function drawBoard() {
    ctx.fillStyle = COLOR_BOARD;
    ctx.strokeStyle = COLOR_BOARDER;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeRect(STROKE / 2, STROKE / 2, WIDTH - STROKE, HEIGHT - STROKE)
}

function drawForms(forms) {
    for (let row of forms) {
        for (let form of row) {
            form.draw()
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

function newGame() { //add number of each form or the proportion in the futur
    forms = [];
    for (i = 0; i < GRID_SIZE; i++) {
        forms[i] = [];
        for (j = 0; j < GRID_SIZE; j++) {
            alea = Math.random();
            if (alea < 1 / 3) {
                forms[i][j] = new Square(getGridX(j), getGridY(i), SQUARE_SIZE, SQUARE_SIZE);
            } else if (alea < 2 / 3) {
                forms[i][j] = new Circle(getGridX(j), getGridY(i));
            } else {
                forms[i][j] = new Triangle(getGridX(j), getGridY(i));
            }
        }
    }
    return forms;
}

function highlightsForms( /* type MouseEvent*/ event) {
    //get mouse position relative to the canvas
    let x = event.clientX - canvBoundings.left;
    let y = event.clientY - canvBoundings.top;

    //clear previous highlight
    for (let row of forms) {
        for (let form of row) {
            form.highlight = false; //create this attribute
        }
    }
    //look for forms to highlight
    OUTER: for (let row of forms) {
        for (let form of row) {
            if (form.contains(x, y)) {
                form.highlight = true; //create this attribute !
                break OUTER; //if one form is to highlight no need to look further
            }
        }
    }

}