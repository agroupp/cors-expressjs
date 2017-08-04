'use strict';

const expect = require('chai').expect;
const Cors = require('../');

describe('Class Cors', function(){
    it('must be class Cors', function(){
        const testCors = new Cors();
        expect(testCors).to.be.instanceOf(Cors);
    });
    it('must have method "middleware" and it must be middleware function');
    it('must have property "options" and it must be an object');
})