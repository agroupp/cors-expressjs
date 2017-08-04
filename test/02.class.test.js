'use strict';

const expect = require('chai').expect;
const Cors = require('../');
const corsDefaultOptions = require('../lib/default-options.const');

describe('Class Cors', function(){
    it('must be class Cors', function(){
        const testCors = new Cors();
        expect(testCors).to.be.instanceOf(Cors);
    });
    it('must have method "middleware" and return middleware function', function(){
        const testCors = new Cors();
        const middleWareFunction = testCors.middleWare;
        expect(testCors.middleWare).to.be.a('function');
        expect(testCors.middleWare()).to.be.a('function');
        expect(testCors.middleWare().length).to.be.equal(3);
    });
    it('must have property "options" and it must be an object', function(){
        const testCors = new Cors();
        expect(testCors).to.have.property('options');
        expect(testCors.options).to.be.a('object');
    });
    describe('options', function(){
        it('allowedOrigin by default must be "*" and must be set in init or by method "setAllowedOrigin"', function(){
            const testCors1 = new Cors();
            expect(testCors1.getOptions().allowedOrigin).to.be.equal('*');
            const testCors2 = new Cors({ allowedOrigin: 'http://localhost:12345'});
            expect(testCors2.getOptions().allowedOrigin).to.be.equal('http://localhost:12345');
            const testCors3 = new Cors();
            testCors3.setAllowedOrigin();
            expect(testCors3.getOptions().allowedOrigin).to.be.equal('*');
            testCors3.setAllowedOrigin('http://localhost:54321');
            expect(testCors3.getOptions().allowedOrigin).to.be.equal('http://localhost:54321');
        });
        it('allowedHeaders by default must be from default options.', function(){
            const testCors = new Cors();
            expect(testCors.getOptions().allowedHeaders).to.have.members(corsDefaultOptions.allowedHeaders);
        });
        it('allowedHeaders must have ability to be set in init', function(){
            const testCors = new Cors({ allowedHeaders: ['header1', 'header2', 'header3']});
            expect(testCors.getOptions().allowedHeaders).to.have.members(['header1', 'header2', 'header3']);
        });
        it('allowedHeaders can be added by method "addAllowedHeader"', function(){
            const testCors = new Cors();
            testCors.addAllowedHeader();
            expect(testCors.getOptions().allowedHeaders).to.have.members(corsDefaultOptions.allowedHeaders);
            testCors.addAllowedHeader('x-custom-header');
            expect(testCors.getOptions().allowedHeaders).to.have.members(corsDefaultOptions.allowedHeaders)
                .to.include('x-custom-header');
        })
    });
});
