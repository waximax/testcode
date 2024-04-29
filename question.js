function submitAnswer(answer, location) {
    const correctElement = document.getElementById('correctAnswer');
    const correctAnswer = correctElement.getAttribute('data-correct');
    let locations = JSON.parse(localStorage.getItem('locations') || '[]');
    let questionCount = locations.length; // 使用 locations 的长度作为当前问题计数

    if (answer === correctAnswer) {
        locations.push(location);
        localStorage.setItem('locations', JSON.stringify(locations));
        questionCount++; // 用户回答正确，问题计数增加
        localStorage.setItem('questionCount', questionCount); // 更新存储的问题计数
        window.location.href = 'index.html'; // 跳转到 index.html 并进行标记
    } else {
        alert('Wrong answer, please try again!');
    }
}


