let clock = document.getElementById('clock');
let alarmTimeInput = document.getElementById('alarmTime');
let alarmLabelInput = document.getElementById('alarmLabel');
let ringtoneInput = document.getElementById('ringtoneInput');
let setAlarmBtn = document.getElementById('setAlarmBtn');
let testSoundBtn = document.getElementById('testSoundBtn');
let alarmList = document.getElementById('alarmList');
let mathToggle = document.getElementById('mathToggle');
let mathContainer = document.getElementById('mathContainer');
let mathQuestion = document.getElementById('mathQuestion');
let mathAnswer = document.getElementById('mathAnswer');
let submitMathBtn = document.getElementById('submitMathBtn');

let alarms = [];
let currentAnswer = 0;
let isAlarmRinging = false;

// রিংটোন অডিও অবজেক্ট তৈরি
let alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
alarmSound.loop = true;

// ১. ব্রাউজারের সাউন্ড পারমিশন ঠিক করার জন্য টেস্ট বাটন
testSoundBtn.addEventListener('click', function() {
    alarmSound.play().then(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alert('অডিও পারমিশন সফলভাবে চালু হয়েছে! এখন অ্যালার্ম বাজবে।');
        testSoundBtn.style.display = 'none'; // সফল হলে বাটনটি লুকিয়ে যাবে
    }).catch(err => {
        alert('অডিও প্লে করতে সমস্যা হচ্ছে: ' + err);
    });
});

// ২. ইউজারের ফোন থেকে সিলেক্ট করা রিংটোন লোড করা
ringtoneInput.addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        let fileURL = URL.createObjectURL(file);
        alarmSound.src = fileURL;
        alert('আপনার ফোনের রিংটোন সফলভাবে লোড হয়েছে!');
    }
});

// ৩. ঘড়ি আপডেট এবং অ্যালার্ম চেক করা
function updateClock() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let dayOfWeek = now.getDay();

    let ampm = hours >= 12 ? 'PM' : 'AM';
    let displayHours = hours % 12;
    displayHours = displayHours ? displayHours : 12;
    
    let padH = String(displayHours).padStart(2, '0');
    let padM = String(minutes).padStart(2, '0');
    let padS = String(seconds).padStart(2, '0');
    
    clock.innerText = `${padH}:${padM}:${padS} ${ampm}`;

    let currentHour24 = String(now.getHours()).padStart(2, '0');
    let currentMinute = String(now.getMinutes()).padStart(2, '0');
    let currentTimeFormatted = `${currentHour24}:${currentMinute}`;

    if (seconds === 0 && !isAlarmRinging) {
        alarms.forEach(alarm => {
            if (alarm.time === currentTimeFormatted) {
                if (alarm.days.length === 0 || alarm.days.includes(dayOfWeek)) {
                    triggerAlarm(alarm.label);
                }
            }
        });
    }
}

setInterval(updateClock, 1000);

// ৪. নতুন অ্যালার্ম যোগ করা
setAlarmBtn.addEventListener('click', function() {
    let timeVal = alarmTimeInput.value;
    let labelVal = alarmLabelInput.value.trim() || 'অ্যালার্ম';
    let selectedDays = [];

    let dayCheckboxes = document.querySelectorAll('.day-chk');
    dayCheckboxes.forEach(chk => {
        if (chk.checked) {
            selectedDays.push(parseInt(chk.value));
        }
    });

    if (timeVal) {
        alarms.push({ time: timeVal, label: labelVal, days: selectedDays });
        renderAlarmList();
        alert('অ্যালার্ম সফলভাবে সেট করা হয়েছে!');
        alarmTimeInput.value = '';
        alarmLabelInput.value = '';
        dayCheckboxes.forEach(chk => chk.checked = false);
    } else {
        alert('দয়া করে সঠিক সময় দিন!');
    }
});

// ৫. লিস্ট দেখানো
function renderAlarmList() {
    alarmList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        let li = document.createElement('li');
        li.innerHTML = `<b>${alarm.label}</b> (${alarm.time}) <button class="delete-btn" onclick="deleteAlarm(${index})">ডিলিট</button>`;
        alarmList.appendChild(li);
    });
}

// ৬. অ্যালার্ম ডিলিট করা
window.deleteAlarm = function(index) {
    alarms.splice(index, 1);
    renderAlarmList();
};

// ৭. অ্যালার্ম বাজার ফাংশন
function triggerAlarm(label) {
    isAlarmRinging = true;
    alarmSound.play().catch(err => {
        console.log("Play error:", err);
        alert('রিংটোন বাজাতে ব্রাউজার বাধা দিচ্ছে। দয়া করে স্ক্রিনে টাচ করুন।');
    });

    if (mathToggle.checked) {
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        currentAnswer = num1 + num2;

        mathQuestion.innerText = `[${label}] ঘুম ভাঙাতে অংক সমাধান করুন: ${num1} + ${num2} = ?`;
        mathContainer.classList.remove('hidden');
    } else {
        let stop = confirm(`⏰ ${label} বাজার সময় হয়েছে! বন্ধ করতে OK চাপুন।`);
        if (stop) {
            stopAlarm();
        }
    }
}

// ৮. ম্যাথ সলভ করে অ্যালার্ম বন্ধ করা
submitMathBtn.addEventListener('click', function() {
    let userAnswer = parseInt(mathAnswer.value);
    if (userAnswer === currentAnswer) {
        stopAlarm();
        alert('সঠিক উত্তর! অ্যালার্ম বন্ধ হলো।');
    } else {
        alert('ভুল উত্তর! অ্যালার্ম বাজতেই থাকবে, আবার চেষ্টা করুন।');
    }
});

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    mathContainer.classList.add('hidden');
    mathAnswer.value = '';
    isAlarmRinging = false;
}
