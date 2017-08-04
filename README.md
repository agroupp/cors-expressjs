# cors-expressjs
Cors middleware for Express framework

Class based middleware for CORS support for APIs.
Based on article [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

## Installation
Install Cors as an npm module and save it to your package.json file as a dependency:
    
    npm install --save cors-expressjs


## Basic Usage
To start using this middleware you need to create an instance of Cors class. Then you can use middleWare method. Here is example:

    'use strict';
    const express = require('express');
    const Cors = require('cors-expressjs');
    const app = express();
    const cors = new Cors();

    app.use(cors.middleWare());
    app.get('/', (req, res) => res.json({ success: true }));

    app.listen(3000);

That's it. Very simple :)
