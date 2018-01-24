// saving dom to variables:

const $container = $('#container');
const $bird = $('#bird');
const $pole = $('.pole');
const $pole1 = $('#pole_1');
const $pole2 = $('#pole_2');
const $score = $('#score');
const $speedSpan = $('#speed');
const $speedMsg = $('#speed_msg');
const $restartBtn = $('#restart_btn');

// initial setup (values from css needs to parsed in order to be used as number values in JS,
// so we use parseInt() function):

const containerWidth = parseInt($container.width());
const containerHeight = parseInt($container.height());
const poleInitialPosition = parseInt($pole.css('right'));
const poleInitialHeight = parseInt($pole.css('height'));
const birdLeft = parseInt($bird.css('left'));
const birdHeight = parseInt($bird.height());
let speed = 10;


let goUp = false;
let scoreUpdated = false;
let gameOver = false;


const theGame = setInterval(function () {
    // everything inside setInterval runs every 40 miliseconds

    // CHECKING FOR COLLISIONS:

    if (collision($bird, $pole1) || collision($bird, $pole2) || parseInt($bird.css('top')) <= 0 || parseInt($bird.css('top')) > (containerHeight - birdHeight) ) {

        stopTheGame(); // if collision happens, we stop the game

    } else { // if collision didn't happen, we run everything else that we put into setInterval:


        // SETTING THE POLES:

        let poleCurrentPosition = parseInt($pole.css('right'));

        // Update the score if the poles have passed the bird without colliding with it:

        if ( poleCurrentPosition > (containerWidth - birdLeft) ) {
            if (scoreUpdated === false) {
                $score.text(parseInt($score.text()) + 1);
                scoreUpdated = true;
            }
        }

        //check if the poles went out of the container, if it's true, than run code below:
        // (it's like resetting the poles at every 'turn', the 'turn' end after they go off screen)
        if (poleCurrentPosition > containerWidth) {

            // we generte new random height of every pole, up to 100px
            const newHeight = parseInt(Math.random() * 100);

            //now we change height of poles using random value generated above:
            $pole1.css('height', poleInitialHeight + newHeight);
            $pole2.css('height', poleInitialHeight - newHeight);
            // heights are changed every time BEFORE the poles are reset on the board (see below)

            //speed increases on every 'turn':
            speed += 1;
            // as with poles hight, the speed increases every time BEFORE the poles are reset
            $speedSpan.text(speed); // new speed value is displayed

            scoreUpdated = false;

            // pole is returned to initial position:
            poleCurrentPosition = poleInitialPosition

        } // end of conditional statement

        //every 40 ms 'right' property will be increased by 10(speed variable), so the poles move to the right
        $pole.css('right', poleCurrentPosition + speed);

        // end of poles settings

        // SETTING CONTROLS:

        if (goUp === false) {
            goDown()
        }

        // MESSAGE DISPLAYED AFTER REACHING CERTAIN SPEED:

        speed > 20 ? $speedMsg.text('Reaching escape velocity! Keep going!') : $speedMsg.text('You can do it!');

    }

}, 40); // everything inside setInterval runs every 40 miliseconds



// SETTING KEYBORD CONTROLS:

//Flying up when pressing [space]:

$(document).on('keydown', function (e) { // keydown - when the key is pressed
    const key = e.keyCode;
    if (key === 32 && goUp === false && gameOver === false) { //32 is [space] index in Unicode, used with .keyCode event
        // why goUp false check? so we don't go up twice
        // gameOver false, beacuse we dont want the player to control the bird after game over
        goUp = setInterval(up, 50) // if we press [space], function 'up' will run every 50 miliseconds
    }
});

//Flying down when releasing [space]:

$(document).on('keyup', function (e) { // keyup - when the key is released
    const key = e.keyCode;
    if (key === 32) { //32 is [space] index in Unicode, used with .keyCode event
        clearInterval(goUp); // we stop goUp function from running
        goUp = false;
    }
});

function goDown() {
    $bird.css('top', parseInt($bird.css('top')) + 5) // distance from top increases
}

function up() {
    $bird.css('top', parseInt($bird.css('top')) - 10) // distance from top decreases, flying is 2x faster than falling
}

function stopTheGame() { // this function stops the game and displays restart button
    clearInterval(theGame);
    gameOver = true;
    $restartBtn.slideDown();
}

// Restart the game after losing (reloads page):

$restartBtn.on('click', function () {
    location.reload()
});

// jQuery doesn't have built-in collision function, so we have to use something like this:
// (takes two arguments and checks if a collision happens)

function collision($div1, $div2) {
    let x1 = $div1.offset().left;
    let y1 = $div1.offset().top;
    let h1 = $div1.outerHeight(true);
    let w1 = $div1.outerWidth(true);
    let b1 = y1 + h1;
    let r1 = x1 + w1;
    let x2 = $div2.offset().left;
    let y2 = $div2.offset().top;
    let h2 = $div2.outerHeight(true);
    let w2 = $div2.outerWidth(true);
    let b2 = y2 + h2;
    let r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}