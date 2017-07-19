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
    }

    return displayUpdates;
  },
  formatUpdate: function(update, index) {
    var self = this,
        inner = '';

    switch(update.type) {
      case 'incarceration':
        inner += self.link(nominals[update.nominal].given_names + ' ' + nominals[update.nominal].family_name, 'nominal', update.nominal);
        inner += ' incarcerated at ';
        inner += self.bold(self.link(prisons[update.location], 'prison', update.location));
        break;
      case 'release':
        inner += self.link(nominals[update.nominal].given_names + ' ' + nominals[update.nominal].family_name, 'nominal', update.nominal);
        inner += ' released from ';
        inner += self.link(prisons[update.location], 'prison', update.location);
        inner += ' ';
        inner += update.releaseString;
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
        inner += ' affiliated with ';
        inner += self.link(ocgs[update.ocg].name, 'ocg', update.ocg);
        break;
    }

    inner = '<span class="update-inner">' + inner + '</span>';

    return {
      updateDisplay: inner,
      updateType: update.type,
      timeAgo: update.timeAgo
    };
  },

  bold: function(str) {
    return '<strong>' + str + '</strong>';
  },

  link: function(text, type, index) {
    return '<a href="/' + type + '/' + index + '">' + text + '</a>'
  }
};

module.exports = updateTools;
