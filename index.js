function swapDisplayMode() {
    let mode = $("html").attr("data-bs-theme");
    mode = (mode === "light") ? "dark" : "light";
    $("html").attr("data-bs-theme", mode);
    $("#css-link").attr("href", `./css/${mode}mode.css`);
}

$("#swap-mode").on("change", swapDisplayMode);

var wumpusWorld, activeSpace, score;

function placeWumpus() {
    //set wumpus position
    const wumpusPos = Math.floor(Math.random() * 15) + 1;
    wumpusWorld[wumpusPos].wumpus = true;

    // Create stench around Wumpus
    const wumpusCoordinates = wumpusWorld[wumpusPos].space;
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    directions.forEach(([dx, dy]) => {
        const newX = wumpusCoordinates[0] + dx;
        const newY = wumpusCoordinates[1] + dy;

        if (newX >= 1 && newX <= 4 && newY >= 1 && newY <= 4) {
            const spaceToModify = wumpusWorld.find(square =>
                square.space[0] === newX && square.space[1] === newY
            );
            spaceToModify.stench = true;
        }
    });
}
function placePits() {
    //set pit positions
    for (let i = 1; i < wumpusWorld.length; i++) {
        //cannot place pit and wumpus in the same space
        if (wumpusWorld[i].wumpus === true) {
            continue;
        }
        //chance of pit is 20%
        const randomInt = Math.random();
        if (randomInt < 0.2) {
            wumpusWorld[i].pit = true;
            const pitCoordinates = wumpusWorld[i].space;
            const directions = [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ];

            directions.forEach(([dx, dy]) => {
                const newX = pitCoordinates[0] + dx;
                const newY = pitCoordinates[1] + dy;

                if (newX >= 1 && newX <= 4 && newY >= 1 && newY <= 4) {
                    const spaceToModify = wumpusWorld.find(square =>
                        square.space[0] === newX && square.space[1] === newY
                    );
                    spaceToModify.breeze = true;
                }
            });
        }
    }
}
function placeGold() {
    while (true) {
        const goldPos = Math.floor(Math.random() * 15) + 1;
        if (wumpusWorld[goldPos].wumpus === false && wumpusWorld[goldPos].pit === false) {
            wumpusWorld[goldPos].gold = true;
            break;
        }
    }
}

function moveCharacter() {
    $(".human-photo").remove();
    $(`section.container > .row${activeSpace.space[0]} > .col${activeSpace.space[1]}`).append('<img src="./assets/human.png" class="human-photo" alt="human" height="200">');
}

function moveLeft() {
    const newX = activeSpace.space[0];
    const newY = activeSpace.space[1] - 1;
    if (newY >= 1 && newY <= 4) {
        activeSpace = wumpusWorld.find(square =>
            square.space[0] == newX & square.space[1] === newY
        );
        moveCharacter();
    } else {
        alert("Cannot move left");
    }
}

function moveRight() {
    const newX = activeSpace.space[0];
    const newY = activeSpace.space[1] + 1;
    if (newY >= 1 && newY <= 4) {
        activeSpace = wumpusWorld.find(square =>
            square.space[0] == newX & square.space[1] === newY
        );
        moveCharacter();
    } else {
        alert("Cannot move right");
    }
}

function moveUp() {
    const newX = activeSpace.space[0] + 1;
    const newY = activeSpace.space[1];
    if (newX >= 1 && newX <= 4) {
        activeSpace = wumpusWorld.find(square =>
            square.space[0] == newX & square.space[1] === newY
        );
        moveCharacter();
    } else {
        alert("Cannot move up");
    }
}

function moveDown() {
    const newX = activeSpace.space[0] - 1;
    const newY = activeSpace.space[1];
    if (newX >= 1 && newX <= 4) {
        activeSpace = wumpusWorld.find(square =>
            square.space[0] == newX & square.space[1] === newY
        );
        moveCharacter();
    } else {
        alert("Cannot move down");
    }
}

function displaySquareDetails() {
    const newDOMElement = `
        <ul class="square-details montserrat fs-4 mt-5">
            ${activeSpace.wumpus ? '<li class="text-danger-emphasis">Wumpus</li>' : ''}
            ${activeSpace.pit ? '<li class="text-success-emphasis">Pit</li>' : ''}
            ${activeSpace.gold ? '<li class="text-warning-emphasis">Gold</li>' : ''}
            ${activeSpace.stench ? '<li class="text-success-emphasis">Stench</li>' : ''}
            ${activeSpace.breeze ? '<li class="text-light-emphasis">Breeze</li>' : ''}
            ${!activeSpace.wumpus && !activeSpace.pit && !activeSpace.gold && !activeSpace.stench && !activeSpace.breeze ? '<li class="text-primary">No observations</li>' : ''}
        <ul>
    `;
    $(`section.game-container .row${activeSpace.space[0]} > .col${activeSpace.space[1]} > .lock-photo`).remove();
    $(`section.game-container .row${activeSpace.space[0]} > .col${activeSpace.space[1]}`).append(newDOMElement);
}

function findWumpus() {
    score -= 1000;
    updateScore();


    const diedToWumpusPhoto = `
    <div id="wumpus-pic">
    <img src="./assets/wumpus.png" alt="wumpus">
    <h1 class="poppins text-black">You died to wumpus</h1>
    </div>
    `;
    $("header.navbar").css("filter", "blur(10px)");
    $("section.game-container").css("filter", "blur(10px)");
    $(".container").css("filter", "blur(10px)");
    $("body").append(diedToWumpusPhoto);
    setTimeout(function() {
        $("#wumpus-pic").remove();
        $("header.navbar").css("filter", "blur(0px)");
        $("section.game-container").css("filter", "blur(0px)");
        $(".container").css("filter", "blur(0px)");
    }, 3000);
}

function findGold() {
    score += 1000;
    updateScore();


    const foundGoldPhoto = `
    <div id="gold-pic">
    <img src="./assets/gold.png" alt="gold">
    <h1 class="poppins text-black">You found the gold</h1>
    </div>
    `;
    $("header.navbar").css("filter", "blur(10px)");
    $("section.game-container").css("filter", "blur(10px)");
    $(".container").css("filter", "blur(10px)");
    $("body").append(foundGoldPhoto);
    setTimeout(function() {
        $("#gold-pic").remove();
        $("header.navbar").css("filter", "blur(0px)");
        $("section.game-container").css("filter", "blur(0px)");
        $(".container").css("filter", "blur(0px)");
    }, 3000);
}

function findPit() {
    score-= 1000;
    updateScore();


    const foundPitPhoto = `
    <div id="pit-pic">
    <img src="./assets/pit.png" alt="pit">
    <h1 class="poppins text-black">You died to a pit</h1>
    </div>
    `;
    $("header.navbar").css("filter", "blur(10px)");
    $("section.game-container").css("filter", "blur(10px)");
    $(".container").css("filter", "blur(10px)");
    $("body").append(foundPitPhoto);
    setTimeout(function() {
        $("#pit-pic").remove();
        $("header.navbar").css("filter", "blur(0px)");
        $("section.game-container").css("filter", "blur(0px)");
        $(".container").css("filter", "blur(0px)");
    }, 3000);
}

function openDoor() {
    if (activeSpace.visited === false) {
        activeSpace.visited = true;
        displaySquareDetails();

        score -= 10;
        updateScore();

        if (activeSpace.gold === true) {
            endGame();
            findGold();
        } else if (activeSpace.wumpus === true) {
            endGame();
            findWumpus();
        } else if (activeSpace.pit === true) {
            endGame();
            findPit();
        }
    }
}

function useSensor() {
    if (activeSpace.visited === false) {
        displaySquareDetails();
        activeSpace.visited = true;

        score -= 100;
        updateScore();

        if (activeSpace.gold === true) {
            endGame();
            findGold();
        }
    }
}

function updateScore() {
    $("#score").remove();
    $("section.game-details").append(`<h4 id='score' class='poppins text-center'>score: ${score}</h4>`)
}

function resetGame() {
    $("section.container > .row > div > *").remove();
    $("section.container > .row > div").append('<img src="./assets/padlock.png" class="lock-photo mt-5" alt="lock" height="100">');
    $("#open-door").removeClass("disabled");
    $("#use-sensor").removeClass("disabled");

    score = 0;

    wumpusWorld = [
        {
            space: [1, 1],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [1, 2],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [1, 3],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [1, 4],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [2, 1],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [2, 2],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [2, 3],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [2, 4],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [3, 1],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [3, 2],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [3, 3],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [3, 4],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [4, 1],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [4, 2],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [4, 3],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
        {
            space: [4, 4],
            wumpus: false,
            pit: false,
            gold: false,
            stench: false,
            breeze: false,
            visited: false,
        },
    ];

    placeWumpus();
    placePits();
    placeGold();

    activeSpace = wumpusWorld[0];


    $(document).off();
}

function initializeGame() {
    resetGame();

    updateScore();

    moveCharacter();
    $(document).on("keypress", function (event) {
        const pressedKey = event.originalEvent.key;

        if (pressedKey === 'w' || pressedKey === 'W') {
            moveUp();
        } else if (pressedKey === 'a' || pressedKey === 'A') {
            moveLeft();
        } else if (pressedKey === 's' || pressedKey === 'S') {
            moveDown();
        } else if (pressedKey === 'd' || pressedKey === 'D') {
            moveRight();
        }
    });


    $("#open-door").on("click", openDoor);

    $("#use-sensor").on("click", function() {
        useSensor();
        $(this).addClass("disabled");
    });
}

function endGame() {
    $(document).off("keypress");
    $("#open-door").addClass("disabled");
    for (let i=0; i<wumpusWorld.length; i++) {
        if (wumpusWorld[i].visited === true) {
            continue;
        }
        activeSpace = wumpusWorld[i];
        displaySquareDetails();
    }
}

$("#start-game").on("click", initializeGame);