let alarms = [];
let ringingAlarmIndex = null;
let currentStep = 0;
let expectedAnswer;

function enableSound() {
    let audio = document.getElementById('alarmAudio');
    audio.play().then(() => { audio.pause(); audio.currentTime = 0; document.getElementById('soundActivationBanner').style.display = 'none'; }).catch(e => alert("Error!"));
}

function switchTab(tab) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(tab + 'Section').classList.add('active');
}

function updateClock() {
    const now = new Date();
    document.getElementById('digitalDisplay').innerText = now.toLocaleTimeString();
    
    let currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    let currentDay = now.getDay();
    
    if (now.getSeconds() === 0) {
        alarms.forEach((item, index) => {
            if (item.time === currentTimeStr && (item.days.length === 0 || item.days.includes(currentDay))) {
                triggerAlarm(index);
            }
        });
    }
}
setInterval(updateClock, 1000);

function setAlarm() {
    const time = document.getElementById('alarmTime').value;
    let days = [];
    document.querySelectorAll('.alarm-day:checked').forEach(cb => days.push(parseInt(cb.value)));
    alarms.push({ time, days });
    alert("Alarm set!");
    displayAlarms();
}

function displayAlarms() {
    const list = document.getElementById('alarmList');
    list.innerHTML = "";
    alarms.forEach((item, index) => {
        let li = document.createElement('li');
        li.innerHTML = `<b>${item.time}</b> <button onclick="alarms.splice(${index},1); displayAlarms()">Delete</button>`;
        list.appendChild(li);
    });
}

function triggerAlarm(index) {
    ringingAlarmIndex = index;
    currentStep = 0;
    document.getElementById('alarmAudio').play();
    generateMath();
    document.getElementById('mathModal').style.display = 'flex';
}

function generateMath() {
    let n1 = Math.floor(Math.random()*10), n2 = Math.floor(Math.random()*10);
    expectedAnswer = n1 + n2;
    document.getElementById('mathQuestion').innerText = `${n1} + ${n2} = ?`;
}

function checkMathAnswer() {
    if(parseInt(document.getElementById('mathAnswer').value) === expectedAnswer) {
        currentStep++;
        if(currentStep >= 3) {
            document.getElementById('alarmAudio').pause();
            document.getElementById('mathModal').style.display = 'none';
        } else { generateMath(); }
    }
}
