function Ticker() {
  // For iPhone compatibility
  var arr = "2016-10-01 00:00:00".split(/[- :]/);
  this.epoch = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

  this.rate_per_second = 0.5787037037;
  this.initial_counter = 25000000;
  this.first_pass = true;
  this.last_reach = 0;
};

Ticker.prototype.start_counters = function() {
  this.start_standard_counters();
  this.start_live_counter();
};

// Standard counter from zero to destination defined in data-attr
Ticker.prototype.start_standard_counters = function() {
  $('.counter').each(function() {
    $(this).prop('Counter', 0).animate({
      Counter: $(this).data('to')
    },
    {
      duration: 4000,
      easing: 'swing',
      step: function (now) {
        number = Math.ceil(now);
        Counter: $(this).data('to', number);
        $(this).text(window.numberWithCommas(number));
      }
    })
  });
};

Ticker.prototype.calculate_increase = function() {
  current_date = new Date();
  difference_in_seconds = (current_date - this.epoch) / 1000;

  this.last_reach = parseInt(this.initial_counter + (difference_in_seconds*this.rate_per_second));

  return this.last_reach;
};

Ticker.prototype.duration = function() {
  if(this.first_pass) {
    return 4000;
  } else {
    return 500;
  }
};

Ticker.prototype.next_counter_time = function() {
  return 1000 + Math.random() * 3000;
}

Ticker.prototype.queue_next_counter = function() {
  that = this;
  setTimeout(
    function() {
      that.start_live_counter();
    },
    that.next_counter_time()
  );
}

// Live counter, after reaching initial destination, starts to grow infinitely
Ticker.prototype.start_live_counter = function() {
  that = this;

  $('.live-counter').each(function () {
    $(this).prop('Counter', that.last_reach).animate({
      Counter: that.calculate_increase()
    },
    {
      duration: that.duration(),
      easing: 'swing',
      step: function (now) {
        number = Math.ceil(now);
        $(this).text(window.numberWithCommas(number));
      },
      complete: function () {
        that.first_pass = false;
        that.queue_next_counter();
      }
    })
  });
};

window.numberWithCommas = function(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function() {

  ticker = new Ticker();
          ticker.start_counters();

});


/* <div class="column"> <h2 class="live-counter"></h2> <h3>Tickets vendidos</h3> </div>*/
