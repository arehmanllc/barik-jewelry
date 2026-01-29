function getCountDown(container){
  // Fade countdown in
  setTimeout(function() {
    container.querySelectorAll('.countdown__time--wrapper').forEach((item, i) => {
      item.style.opacity = 1;
    });
  }, 100);

  var timestamp = container.getAttribute('data-launch-date'),
      timestamp = parseInt(timestamp);

  if ( !timestamp ) return false;

  var hideAfterCountdown = container.getAttribute('data-hide-after-countdown') === 'true';

  var count = setInterval(function(){
    var nowTime = new Date();
    var endTime = new Date(timestamp * 1000);

    var t = endTime.getTime() - nowTime.getTime();

    if (t <= 0) {
      clearInterval(count);
      container.querySelectorAll('.countdown__time--wrapper').forEach((item, i) => {
        item.style.display = 'none'; // Hide the countdown elements
      });
      container.querySelector('.countdown__time--content').style.display = 'none'; // Hide countdown text
      container.querySelector('.countdown__ended--content').style.display = 'flex'; // Show completed text

      if (hideAfterCountdown) {
        container.style.display = 'none'; // Hide the container if required
      }

      return;
    }

    var days = Math.floor(t/1000/60/60/24);
    var hours = Math.floor(t/1000/60/60%24);
    var mins = Math.floor(t/1000/60%60);
    var secs = Math.floor(t/1000%60);

    if (days < 10) {
      days = "0" + days;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (mins < 10) {
      mins = "0" + mins;
    }
    if (secs < 10) {
      secs = "0" + secs;
    }

    if ( days >= 0 ) container.querySelector('[data-launch-days]').innerHTML = days;
    if ( hours >= 0 ) container.querySelector('[data-launch-hours]').innerHTML = hours;
    if ( mins >= 0 ) container.querySelector('[data-launch-mins]').innerHTML = mins;
    if ( secs > 0 ) container.querySelector('[data-launch-secs]').innerHTML = secs;

  },1000);
}

document.querySelectorAll('[data-section-type="countdown"]').forEach(function(container, i){
  getCountDown(container);
});
document.addEventListener("shopify:section:select", function(event) {
  if (!event.target.querySelector('[data-section-type="countdown"]')) return false;
  var container = event.target.querySelector('[data-section-type="countdown"]');

  getCountDown(container);
});