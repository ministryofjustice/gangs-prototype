(function() {

  var SelectUserType = {
    radioName: 'select-user-type',
    emailSuffix: '@example.com',

    init: function() {
      this.bindEvents();
    },

    bindEvents: function() {
      var self = this;

      $('[name=' + self.radioName + ']').on('change', function(e) {
        var newUserType = $(e.target).val();
        $('#user_type').val(newUserType);
        $('#username').val(newUserType + self.emailSuffix);
      });
    }
  };

  SelectUserType.init();
})();
