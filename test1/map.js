let map;
let timer;
let timeLeft = 600; // 10 minutes in seconds
let markers = []; // 用来存储地图上的标记
// 必须标记的所有地点列表
let allLocations = [
    { lat: 52.9390420, lng: -1.1973884 }, 
    { lat: 52.9391525, lng: -1.1971698 },
    { lat: 52.9388910, lng: -1.1970893 },
    { lat: 52.9388809, lng: -1.1971299 },
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

function updateMap() {
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
    markers.forEach(marker => marker.setMap(null)); // 清除之前的标记
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
}




function countdown() {
    if (timeLeft <= 0) {
        clearTimeout(timer);
        endGame();
        localStorage.removeItem('timeLeft'); // 清除时间，防止错误重用
    } else {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;
        localStorage.setItem('timeLeft', timeLeft); // 更新存储的时间
        timer = setTimeout(countdown, 1000);
    }
}


function resetGame() {
    localStorage.clear(); // 清除所有localStorage数据
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    clearTimeout(timer);
    timeLeft = 600; // 重置为初始值
    localStorage.setItem('timeLeft', timeLeft); // 重新设置剩余时间
    countdown();
    document.getElementById('gameStatus').innerText = '';
    updateMap();
}


function endGame() {
    clearTimeout(timer);
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
    let isVictory = allLocations.every(requiredLoc =>
        locations.some(loc => loc.lat === requiredLoc.lat && loc.lng === requiredLoc.lng));

    let usedTime = 600 - timeLeft;
    let minutes = Math.floor(usedTime / 60);
    let seconds = usedTime % 60;
    let timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (isVictory) {
        document.getElementById('gameStatus').innerText = `游戏胜利！用时：${timeString}`;
    } else {
        document.getElementById('gameStatus').innerText = '游戏失败！未能在规定时间内完成或未正确回答所有问题。';
    }
}



function initGame() {
    const savedTimeLeft = localStorage.getItem('timeLeft'); // 获取存储的剩余时间
    if (savedTimeLeft) {
        timeLeft = parseInt(savedTimeLeft, 10); // 确保转换为数字
    }
    initMap();
    updateMap();
    countdown();
}

window.addEventListener('storage', () => {
    updateMap(); // 当本地存储变化时更新地图
});
