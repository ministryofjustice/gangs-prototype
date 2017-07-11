// nominal tools module
var humanize = require('humanize');

var ocgs = require('../assets/data/dummy-ocgs.json').ocgs;
var nominals = require('../assets/data/dummy-nominals.json').nominals;
var updates = require('../assets/data/updates.json');
var prisons = require('../sources/prisons.json').prisons;
var quantities = require('../sources/quantities.json');

var updateTools = {
  updatesForDisplay: function(quantityPerType) {
    var self = this;

    if(!quantityPerType || (quantityPerType > quantities.updatesPerType)) {
      quantityPerType = quantities.updatesPerType;
    }

    var displayUpdates = {};

    for(var type in updates) {
      displayUpdates[type] = [];

      for(var x = 0; x < quantityPerType; x++) {
        displayUpdates[type].push(self.formatUpdate(updates[type][x], x));
      }
      displayUpdates[type] = self.addTimeStamps(displayUpdates[type]);
    }

    return displayUpdates;
  },
  formatUpdate: function(update, index) {
    var self = this,
        inner = '';

    switch(update.type) {
      case 'incarceration':
        inner += self.link(nominals[update.nominal].given_names + ' ' + nominals[update.nominal].family_name, 'nominal', update.nominal);
        inner += ' was incarcerated at ';
        inner += self.bold(self.link(prisons[update.location], 'prison', update.location));
        break;
      case 'release':
        inner += self.link(nominals[update.nominal].given_names + ' ' + nominals[update.nominal].family_name, 'nominal', update.nominal);
        inner += ' was released from ';
        inner += self.link(prisons[update.location], 'prison', update.location);
        break;
      case 'tension-change':
        inner += 'Tension between ';
        inner += self.link(ocgs[update.ocg1].name, 'ocg', update.ocg1);
        inner += ' and ';
        inner += self.link(ocgs[update.ocg2].name, 'ocg', update.ocg2);
        inner += ' changed to <strong class="tc-' + update.newTensionLevel + '">';
        inner += update.newTensionLevel;
        inner += '</strong>';
        inner += '</span><span class="tension-arrow tension-arrow-' + update.newTensionLevel + '">&nbsp;</i>';
        break;
      case 'affiliation':
        inner += self.link(nominals[update.nominal].given_names + ' ' + nominals[update.nominal].family_name, 'nominal', update.nominal);
        inner += ' is now affiliated with ';
        inner += self.link(ocgs[update.ocg].name, 'ocg', update.ocg);
        break;
    }

    inner = '<span class="update-inner">' + inner + '</span>';

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
        maxMinutes = 2000;

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
    if(minutesAgo < 60) {
      return minutesAgo + 'm';
    } else if(minutesAgo < 1440) {
      return Math.floor(minutesAgo / 60) + 'h';
    } else {
      return Math.floor(minutesAgo / 1440) + 'd';
    }
  }
};

module.exports = updateTools;
