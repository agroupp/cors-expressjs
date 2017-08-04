'use strict';

const expect = require('chai').expect;
const Cors = require('../');
const express = require('express');
const request = require('supertest');

const testServerPort = 63265;

describe('Middleware', function(){
    const app = testServer();
    before(function(){
        app.listen(testServerPort);
    })
    describe('Test environment ready', function(){
        it('must work route "/" GET method', function(done){
            request(app)
            .get('/')
            .expect(200, { success: true })
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
        });
        it('must work route "/" POST method', function(done){
            request(app)
            .post('/')
            .set('Accept', 'application/json')
            .send({ data: 'test body' })
            .expect(200, { success: true, request: { data: 'test body' }})
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
        });
    });
    describe('CORS Middleware', function(){
        it('must respond to GET request to "/" with "Access-Control-Allow-Origin: *"', function(done){
            request(app)
            .get('/')
            .set('Origin', 'http://test-server')
            .expect(200, { success: true })
            .end(function(err, res){
                if (err) return done(err);
                const header = res.res.headers['Access-Control-Allow-Origin'.toLocaleLowerCase()];
                if (!header || header !== '*') return done(new Error('Access-Control-Allow-Origin is not returned or not *'));
                done();
            });
        });
        it('must respond to OPTIONS request to "/" with set of headers', function(done){
            request(app)
            .options('/')
            .set('Origin', 'http://test-server')
            .set('Access-Control-Request-Method', 'POST')
            .set('Access-Control-Request-Headers', 'Content-Type')
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                const header1 = res.res.headers['Access-Control-Allow-Origin'.toLocaleLowerCase()];
                const header2 = res.res.headers['Access-Control-Allow-Methods'.toLocaleLowerCase()];
                const header3 = res.res.headers['Access-Control-Allow-Headers'.toLocaleLowerCase()];
                const header4 = res.res.headers['Access-Control-Max-Age'.toLocaleLowerCase()];
                if (!header1 || header1 !== '*') return done(new Error('Access-Control-Allow-Origin is not returned or not *'));
                if (!header2 || header2.indexOf('POST') === -1) return done(new Error('Access-Control-Allow-Methods is not returned or no POST in it'));
                if (!header3 || header3.indexOf('Content-Type'.toLocaleLowerCase()) === -1) return done(new Error('Access-Control-Allow-Headers is not returned or no "Content-Type" in it'));
                if (!header4) return done(new Error('Access-Control-Max-Age is not returned'));
                done();
            });
        });
    });
});

function testServer(){
    const app = express();

    function rootRoutes(){
        const router = express.Router();
        const bodyParser = require('body-parser');
        const Cors = require('../');
        const cors = new Cors();
        router.use(cors.middleWare());
        router.get('/', (req, res) => res.json({ success: true }));
        router.post('/', bodyParser.json(), (req, res) => res.json({ success: true, request: req.body }));
        return router;
    }
    app.use('/', rootRoutes());
    return app;
}
