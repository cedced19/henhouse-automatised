var Waterline = require('waterline');
var hash = require('password-hash-and-salt');

var Registrants = Waterline.Collection.extend({
    identity: 'registrants',
    connection: 'save',
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        }
    }
});

module.exports = Registrants;
