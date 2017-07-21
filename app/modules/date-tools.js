var dateTools = {
  dateWithinDaysOfNow: function(days) {
    var date = new Date();
    date.setDate(date.getDate() + (Math.random() * days));
    return date;
  },
  daysAgoString: function(daysAgo) {
    var string = daysAgo + ' days ago';

    if(daysAgo === 0) {
      string = 'today';
    } else if(daysAgo === 1) {
      string = 'yesterday';
    }

    return string;
  }
};

module.exports = dateTools;
