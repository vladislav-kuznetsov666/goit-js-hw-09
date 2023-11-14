import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      Notiflix.Notify.failure("Please choose a date in the future");
      document.querySelector('[data-start]').disabled = true;
    } else {
      document.querySelector('[data-start]').disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer(endDate) {
  const currentDate = new Date();
  const difference = endDate - currentDate;

  if (difference <= 0) {
    clearInterval(timerInterval);
    Notiflix.Notify.success("Countdown completed!");
    document.querySelector('[data-start]').disabled = true;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(difference);
  
  document.querySelector('[data-days]').innerHTML = `<span>${addLeadingZero(days)}</span>d`;
  document.querySelector('[data-hours]').innerHTML = `<span>${addLeadingZero(hours)}</span>h`;
  document.querySelector('[data-minutes]').innerHTML = `<span>${addLeadingZero(minutes)}</span>m`;
  document.querySelector('[data-seconds]').innerHTML = `<span>${addLeadingZero(seconds)}</span>s`;
}

let timerInterval;

document.querySelector('[data-start]').addEventListener('click', () => {
  const selectedDate = flatpickr.parseDate(document.querySelector('#datetime-picker').value, "Y-m-d H:i");
  if (!selectedDate) {
    Notiflix.Notify.failure("Please choose a valid date");
    return;
  }

  document.querySelector('[data-start]').disabled = true;

  timerInterval = setInterval(() => {
    updateTimer(selectedDate);
  }, 1000);

  updateTimer(selectedDate);
});
