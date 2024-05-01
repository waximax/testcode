let map;
let timer;
let timeLeft = 600; // 15 minutes in seconds
let questionCount = 0; // To track number of correctly answered questions
let markers = []; // 用来存储地图上的标记
// 必须标记的所有地点列表
let allLocations = [
    
    { lat: 52.9387647, lng: -1.1973495 },
    { lat: 52.9390042, lng: -1.1968389 },
    { lat: 52.9389975, lng: -1.1968476 },
    // 这里添加其他必须标记的地点
];

function initMap() {
    const hallwardLibrary = { lat: 52.9389025, lng: -1.1971936 }; // 根据实际情况调整坐标
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 19,
        center: hallwardLibrary
    });
}

const clueUrls = [
    
    
    'https://nusearch.nottingham.ac.uk/primo-explore/fulldisplay?docid=44NOTUK_ALMA2172219360005561&context=L&vid=44NOTUK&lang=en_US&search_scope=44NOTUK_COMPLETE&adaptor=Local%20Search%20Engine&tab=44notuk_complete&query=any,contains,charity&facet=rtype,exclude,reviews,lk&offset=0',
    'https://nusearch.nottingham.ac.uk/primo-explore/fulldisplay?docid=44NOTUK_ALMA2171880450005561&context=L&vid=44NOTUK&lang=en_US&search_scope=44NOTUK_COMPLETE&adaptor=Local%20Search%20Engine&isFrbr=true&tab=44notuk_complete&query=any,contains,Jane%20Eyre&sortby=rank&facet=frbrgroupid,include,1231090891&offset=0',



    'https://nusearch.nottingham.ac.uk/primo-explore/fulldisplay?docid=44NOTUK_ALMA21104741970005561&context=L&vid=44NOTUK&lang=en_US&search_scope=44NOTUK_COMPLETE&adaptor=Local%20Search%20Engine&isFrbr=true&tab=44notuk_complete&query=any,contains,the%20rainbow&sortby=rank&facet=frbrgroupid,include,3689459246&offset=0', // 第七个线索链接
];

function updateMap() {
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const infoWindow = new google.maps.InfoWindow();

    locations.forEach((loc, index) => {
        const marker = new google.maps.Marker({
            position: loc,
            map: map,
            title: 'Question ' + (index + 1)
        });
        markers.push(marker);

        // 绑定点击事件到标记
        marker.addListener('click', () => {
            const contentString = `<div><h1>Question ${index + 1}</h1><p>This is the location for Question ${index + 1}.</p></div>`;
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
        });
    });
        updateClueButton(locations.length);
}

function updateClueButton(questionNumber) {
    // 获取查看线索按钮，它不再是 <a> 标签，而是一个 <button>
    const viewClueButton = document.getElementById('viewClueButton'); // 假设你已经为查看线索的按钮添加了这个新的ID
    if (questionNumber < clueUrls.length) {
        // 只需确保按钮是可见的
        viewClueButton.style.display = 'block';
    } else {
        // 如果所有问题都已回答，隐藏查看线索按钮
        viewClueButton.style.display = 'none';
    }
}


function countdown() {
    if (timeLeft <= 0) {
        clearTimeout(timer);
        endGame(true); // 时间耗尽时调用 endGame
    } else {
        document.getElementById('timer').innerText = formatTime(timeLeft);
        timeLeft--;
        localStorage.setItem('timeLeft', timeLeft);
        timer = setTimeout(countdown, 1000);
    }
}

function endGame(isTimeOut) {
    clearTimeout(timer);
    localStorage.removeItem('timeLeft');
    localStorage.removeItem('gameStartTime');
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
    let isVictory = locations.length >= 3;
    let message = isTimeOut ? "Time's up! " : '';
    message += isVictory ? 'You win! ' : 'Try again! ';
    let usedTime = 900 - timeLeft;
    let timeString = formatTime(usedTime);

    let gameStatus = document.getElementById('gameStatus');
    gameStatus.innerText = `${message}Time used: ${timeString}.`;
    gameStatus.style.color = isVictory ? 'green' : 'red'; // 设置消息颜色
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}




function resetGame() {
    localStorage.clear();
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    clearTimeout(timer);
    // 重新设置时间并保存初始状态
    localStorage.setItem('gameStartTime', Date.now());
    timeLeft = 900;
    localStorage.setItem('timeLeft', timeLeft);
    countdown();
    document.getElementById('gameStatus').innerText = '';
    document.getElementById('gameStatus').style.color = 'black';
    updateMap();
}



function viewClue() {
    const questionNumber = JSON.parse(localStorage.getItem('locations') || '[]').length;
    const clueUrl = clueUrls[questionNumber] || clueUrls[0]; // 如果没有更多的问题，则回到第一个线索
    window.open(clueUrl, '_blank'); // 在新标签中打开线索页面
}


function initGame() {
    let savedTimeLeft = localStorage.getItem('timeLeft');
    let gameStartTime = localStorage.getItem('gameStartTime');

    if (!gameStartTime) {
        // 如果没有开始时间，意味着是游戏的第一次开始
        gameStartTime = Date.now();
        localStorage.setItem('gameStartTime', gameStartTime);
        timeLeft = 900; // 游戏时间为15分钟
        localStorage.setItem('timeLeft', timeLeft);
    } else {
        // 如果有开始时间，计算剩余时间
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - parseInt(gameStartTime)) / 1000);
        timeLeft = parseInt(savedTimeLeft) - elapsed;
        // 如果时间已耗尽，应立即结束游戏
        if (timeLeft <= 0) {
            timeLeft = 0;
            endGame(true);
            return;
        }
    }

    countdown();
    initMap();
    updateMap();
}

window.addEventListener('storage', () => {
    updateMap(); // 当本地存储变化时更新地图
});
