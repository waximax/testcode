function submitAnswer(answer, location) {
    const correctElement = document.getElementById('correctAnswer');
    const correctAnswer = correctElement.getAttribute('data-correct');

    if (answer === correctAnswer) {
        let locations = JSON.parse(localStorage.getItem('locations') || '[]');
        locations.push(location);
        localStorage.setItem('locations', JSON.stringify(locations));
        window.location.href = 'index.html'; // 跳转到标记地图的页面
    } else {
        alert('Wrong answer, please try again!');
    }
}
