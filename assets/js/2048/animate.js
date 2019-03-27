function showNumberWithAnimation(i, j, randNumber) {
    let numberCell = $('#number-cell-' + i + '-' + j);

    numberCell.css("background-color", getNumberBackgroundColor(randNumber))
        .css("color", getNumberColor(randNumber))
        .css('border-radius', 0.06 * cellSideLength)
        .text(randNumber)
        .css('font-size', 0.6 * cellSideLength + 'px');

    numberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i, j),
        left: getPosLeft(i, j),
    }, 50);
}

function showMoveAnimation(fromx, fromy, tox, toy) {
    let numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200);
}

function upDateScore(score) {
    // $("#score").animate({
    //     fontSize: "40px",
    //     color: "#f00"
    // }, 100);
    // $("#score").animate({
    //     fontSize: "15px",
    //     color: "#333"
    // }, 100);
    $("#score").text(score);
}