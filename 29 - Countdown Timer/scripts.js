let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds){
  //clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  // console.log({now,then});
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(()=>{
    const secLeft = Math.round((then - Date.now()) / 1000);
    if(secLeft < 0){
      clearInterval(countdown);
    }
    displayTimeLeft(secLeft);
  },1000);
}

function displayTimeLeft(seconds){
  const minutes = Math.floor(seconds / 60);
  const remainderSec = seconds % 60;
  const display = `${minutes}:${remainderSec < 10 ? '0':''}${remainderSec}`;
  document.title = display;
  timerDisplay.textContent = display;
  console.log(minutes,remainderSec);
}

function displayEndTime(timestamp){
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  const isMorning = hour < 12;
  endTime.textContent = `Be Back At ${ isMorning ? hour : (hour - 12)}:${minutes < 10 ? '0' : ''}${minutes}${isMorning ? 'a.m.': 'p.m.'}`;

}

function startTimer(){
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach(button=>button.addEventListener('click',startTimer));

document.customForm.addEventListener('submit',function(e){
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60) ;
  this.reset();
})