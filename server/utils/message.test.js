var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
    if('should generate a correct message object', () => {
        //store res in variable
        var from = 'Rodney';
        var text = 'Listen to my new song';
        var message = generateMessage(from, text);
        
        //assert from match
        //asert text match
        //assert createdAt match
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from: from,
            text: text
        });
    });
});