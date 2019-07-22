const moment = require('moment');

module.exports = {
    formatDate: function (date, targetFormat) {
        return moment(date).format(targetFormat);
    },

    replaceCommas: function(word) {
        if (word != null || word.length !== 0) {
            if (word.trim().length !== 0) {
                return word.replace(/,/g, ' | ');
            }
        }

        return 'None';
    }
};