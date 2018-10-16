var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

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


describe('generateLocationMessage', () =>{
    it('should generate correct location object', () => {
        var from = 'Rodney';
        var latitude = 20;
        var longitude = 25;
        var url = 'https://www.google.com/maps?q=20,25';

        var message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});     
    });
});