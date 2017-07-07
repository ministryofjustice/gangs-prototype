// nominal tools module
var humanize = require('humanize');

var ocgs = require('../assets/data/dummy-ocgs.json').ocgs;
var nominals = require('../assets/data/dummy-nominals.json').nominals;
var updates = require('../assets/data/updates.json').updateEvents;
var prisons = require('../sources/prisons.json').prisons;
var quantities = require('../sources/quantities.json');

var updateTools = {
  updatesForDisplay: function(quantity) {
    var self = this;

    if(!quantity || (quantity > quantities.updates)) {
      quantity = quantities.updates;
    }

    var displayUpdates = [];
    for(var x = 0; x < quantity; x++) {
      displayUpdates.push(self.formatUpdate(updates[x], x));
    }

    displayUpdates = self.addTimeStamps(displayUpdates);

    return displayUpdates;
  },
  formatUpdate: function(update, index) {
    var self = this,
        inner = '';

    switch(update.type) {
      case 'incarceration':
        inner += self.bold(self.link(nominals[update.nominal].given_names + ' ' + nominals[update.nominal].family_name, 'nominal', update.nominal));
        inner += ' was incarcerated at ';
        inner += self.bold(self.link(prisons[update.location], 'prison', update.location));
        break;
      case 'release':
        inner += self.bold(self.link(nominals[update.nominal].given_names + ' ' + nominals[update.nominal].family_name, 'nominal', update.nominal));
        inner += ' was released from ';
        inner += self.bold(self.link(prisons[update.location], 'prison', update.location));
        break;
      case 'tension-change':
        inner += 'Tension between ';
        inner += self.bold(self.link(ocgs[update.ocg1].name, 'ocg', update.ocg1));
        inner += ' and ';
        inner += self.bold(self.link(ocgs[update.ocg2].name, 'ocg', update.ocg2));
        inner += ' changed to ';
        inner += self.bold(update.newTensionLevel);
        break;
      case 'affiliation':
        inner += self.bold(self.link(nominals[update.nominal].given_names + ' ' + nominals[update.nominal].family_name, 'nominal', update.nominal));
        inner += ' is now affiliated with ';
        inner += self.bold(self.link(ocgs[update.ocg].name, 'ocg', update.ocg));
        break;
    }

    return {
      updateDisplay: inner,
      updateType: update.type
    };
  },

  bold: function(str) {
    return '<strong>' + str + '</strong>';
  },

  link: function(text, type, index) {
    return '<a href="/' + type + '/' + index + '">' + text + '</a>'
  },

  addTimeStamps: function(updates) {
    // generate random timestamps for display each time, so that they remain
    // recent even when the updates aren't regenerated

    var self = this,
        minutesArray = [],
        minMinutes = 1,
        maxMinutes = 8000;

    for(var x = 0; x < updates.length; x++) {
      minutesArray.push(Math.floor(Math.random() * (maxMinutes - minMinutes)) + minMinutes);
    }

    minutesArray.sort(function(a, b) {
      return a - b;
    });

    for(var x = 0; x < updates.length; x++) {
      updates[x].timeAgo = self.getTimeAgo(minutesArray[x]);
    }

    return updates;
  },

  getTimeAgo: function(minutesAgo) {
    var nowInSeconds = humanize.time(),
        thenInSeconds = nowInSeconds - (minutesAgo * 60),
        then = new Date(thenInSeconds),
        humanizedThen = humanize.relativeTime(then);

    return humanizedThen;
  }
};

module.exports = updateTools;
