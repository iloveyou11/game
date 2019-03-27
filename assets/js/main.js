let curTheme = 0;
let curGame = 1;
$("#changeTheme").on('click', changeTheme);
$("#changeMusic").on('click', changeMusic);
$("#changeVideo").on('click', changeVideo);
$("#showLyrics").on('click', showLyrics);

$("#changeGameBtn").on('click', changeGameBtn);

function changeTheme() {
    if (curTheme !== 10) {
        curTheme++;
    } else {
        curTheme = 1;
    }
    let newSrc = themes[curTheme];
    $(".sky").remove();
    $('body').css("background-image", `url('${newSrc}')`)
}

function changeMusic() {
    alert('客官别急，功能正在完善中~~')
}

function changeVideo() {
    alert('客官别急，功能正在完善中~~')
}

function showLyrics() {
    alert('客官别急，功能正在完善中~~')
}

function changeGameBtn() {
    if (curGame === 1) {
        $('.game-container1').css("display", "none")
        $('.game-container2').css("display", "block")
        curGame = 2;
    } else {
        $('.game-container1').css("display", "block")
        $('.game-container2').css("display", "none")
        curGame = 1;
    }

}