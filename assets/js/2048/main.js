let board = [];
let score = 0;
let hasConflicted = [];
let cellSideLength = 100;


$(document).ready(function() {
    newgame();
})

function newgame() {
    init();
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }
    }
    for (let i = 0; i < 4; i++) {
        board[i] = []
        hasConflicted[i] = []
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();

    score = 0;
}

function updateBoardView() {
    $(".number-cell").remove();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            $(".grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            let theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] === 0) {
                theNumberCell
                    .css('width', '0px')
                    .css('height', '0px')
                    .css("top", getPosTop(i, j) + 0.5 * cellSideLength)
                    .css("left", getPosLeft(i, j) + 0.5 * cellSideLength);
            } else if (board[i][j] > 1000) {
                theNumberCell
                    .css('width', cellSideLength)
                    .css('height', cellSideLength)
                    .css("top", getPosTop(i, j))
                    .css("left", getPosLeft(i, j))
                    .css('background-color', getNumberBackgroundColor(board[i][j]))
                    .css('color', getNumberColor(board[i][j]))
                    .text(board[i][j])
                    .css('font-size', 0.4 * cellSideLength + 'px');
            } else {
                theNumberCell
                    .css('width', cellSideLength)
                    .css('height', cellSideLength)
                    .css("top", getPosTop(i, j))
                    .css("left", getPosLeft(i, j))
                    .css('border-radius', 0.06 * cellSideLength)
                    .css('background-color', getNumberBackgroundColor(board[i][j]))
                    .css('color', getNumberColor(board[i][j]))
                    .text(board[i][j])
                    .css('font-size', 0.6 * cellSideLength + 'px');
            }
            hasConflicted[i][j] = false;
        }
    }
    $('.number-cell').css('line-height', cellSideLength + 'px');
}

function generateOneNumber() {
    //判断是否存在空间
    if (nospace(board))
        return false;

    //随机生成一个位置
    let randx = parseInt(Math.floor(Math.random() * 4));
    let randy = parseInt(Math.floor(Math.random() * 4));

    // 解决不流畅问题，当棋盘只剩下一个空格时，计算机会花费大量的循环去找此位置
    let times = 0;
    while (times < 50) {
        if (board[randx][randy] === 0)
            break
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    // 当计算机循环50次还未找到空位时，则手动去找此位置
    if (times === 50) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机生成一个数字 
    let ranNumber = Math.random() < 0.5 ? 2 : 4;
    //在随机位置上添加随机数字
    board[randx][randy] = ranNumber;
    showNumberWithAnimation(randx, randy, ranNumber);
    return true;
}

// 监听玩家的键盘按下事件
$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37:
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isganeover();", 300);
            }
            break; //left

        case 38:
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                event.preventDefault(); //阻止事件冒泡
                setTimeout("isganeover();", 300);
            }
            break; //up

        case 39:
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isganeover();", 300);
            }
            break; //right

        case 40:
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                event.preventDefault(); //阻止事件冒泡
                setTimeout("isganeover();", 300);
            }
            break; //down

        default:
            break;
    }
})

function isganeover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert("GAMEOVER!");
}

function moveLeft() {
    if (!canMoveLeft(board)) {
        return false
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (let k = 0; k < j; k++) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        upDateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200); //刷新时间延迟
    return true
}

function moveRight() {
    if (!canMoveRight(board)) //判断是否可以向左移动
        return false;

    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (let k = 3; k > j; k--) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        upDateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    //updateBoardView();
    setTimeout("updateBoardView()", 200); //刷新时间延迟
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) //判断是否可以向上移动
        return false;

    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (let k = 0; k < i; k++) {
                    if (board[k][j] === 0 && noBlockVertical(j, k, i, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        //add
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        upDateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    //updateBoardView();
    setTimeout("updateBoardView()", 200); //刷新时间延迟
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) //判断是否可以向左移动
        return false;
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (let k = 3; k > i; k--) {
                    if (board[k][j] === 0 && noBlockVertical(j, i, k, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] === board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        //add
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        upDateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200); //刷新时间延迟
    return true;
}



$("#newGameBtn").on('click', newGame);
$("#stopGameBtn").on('click', stopGame);
$("#restartGameBtn").on('click', restartGame);


function newGame() {
    alert('臭蛋，不要玩游戏，好好学习!')
}

function stopGame() {
    alert('臭蛋，不要玩游戏，好好学习!')
}

function restartGame() {
    alert('臭蛋，不要玩游戏，好好学习!')
}