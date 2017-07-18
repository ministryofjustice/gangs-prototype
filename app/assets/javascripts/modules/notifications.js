(function() {

  var notifications = {
    TRIGGER_KEY: 49, // 1 key, used with shift gives !
    REQUIRE_SHIFT: true,
    NOTIFICATION_OFFSET: 20,
    ELEMENT_HEIGHT: 80,
    animating: false,
    ocgs: [],
    ocgsLoaded: false,

    init: function() {
      this.getOcgs();
      this.bindEvents();
    },

    bindEvents: function() {
      var self = this;

      $(document).on('keyup', function(e) {
        if(e.keyCode === self.TRIGGER_KEY && e.shiftKey === self.REQUIRE_SHIFT && !self.animating && self.ocgsLoaded) {
          self.animating = true;
          self.showNotification();
        }
      });

      $(document).on('click', '.notification-close', function(e) {
        if(!self.animating) {
          self.closeNotification($(e.target).closest('.demo-notification'));
        }
      });
    },

    getOcgs: function() {
      var self = this;

      $.ajax({
        url: '/public/data/dummy-ocgs.json',
        success: function(response, status, xhr) {
          self.ocgs = response.ocgs;
          self.ocgsLoaded = true;
          console.log('OCGs loaded successfully');
        },
        error: function(xhr, status, errorThrown) {
          console.log(status);
          console.log(errorThrown);
        }
      });
    },

    pickOCGs: function() {
      var self = this,
          n = self.ocgs.length,
          ocg1 = Math.floor(Math.random() * n),
          offset = Math.floor(Math.random() * 10) + 5,
          ocg2 = ocg1 + offset;

      if(ocg2 >= n) {
        ocg2 -= n;
      }

      return {
        ocg1: self.ocgs[ocg1].name,
        ocg2: self.ocgs[ocg2].name
      }
    },

    pickTension: function() {
      var tensions = ["high", "medium", "low"];

      return tensions[Math.floor(Math.random() * tensions.length)];
    },

    showNotification: function() {
      var self = this,
          ocgs = self.pickOCGs(),
          tension = self.pickTension(),
          html = '<div class="demo-notification new-notification"><span class="notification-inner">Tension between ' + ocgs.ocg1 + ' and ' + ocgs.ocg2 + ' changed to <strong>' + tension + '</strong></span><span class="notification-close">&times;</span></div>';

      if($('.demo-notification').length) {
        self.nudgeDown(html);
      } else {
        self.newNotification(html);
      }
    },

    newNotification: function(html) {
      var self = this;


      $('body').prepend(html);
      $('.new-notification').animate({
        right: self.NOTIFICATION_OFFSET + 'px'
      }, 300, function() {
        $(this).removeClass('new-notification');
        $(this).addClass('highlight');
        self.animating = false;
      });
    },

    nudgeDown: function(html) {
      var self = this;

      $.when($('.demo-notification').animate({
        top: '+=' + self.ELEMENT_HEIGHT + 'px'
      }, 150)).then(
        self.newNotification(html)
      );
    },

    closeNotification: function($notification) {
      var self = this,
          notificationIndex = $notification.index('.demo-notification'),
          previousNotifications = $('.demo-notification:gt(' + notificationIndex + ')');

      self.animating = true;
      $notification.fadeOut(200, function() {
        $.when($notification.remove()).then(
          $(previousNotifications).animate({
            top: '-=' + self.ELEMENT_HEIGHT + 'px'
          }, 150)
        );
        self.animating = false;
      });
    }
  };

  notifications.init();
})();
