'use strict';

const DEFAULT_OPTIONS = require('./default-options.const');

class Cors {
    /**
     * Initialize new instance of Cors class.
     * @param {object} options 
     */
    constructor(options){
        if (!options){
            this.options = DEFAULT_OPTIONS;
        } else {
            this.options = {};
            for(let option in DEFAULT_OPTIONS){
                this.options[option] = options[option] || DEFAULT_OPTIONS[option];
            }
        }
    }
    /**
     * Return options object. Mostly needed in tests
     */
    getOptions(){
        return this.options;
    }
    /**
     * Sets allowed origin
     * @param {string} origin 
     */
    setAllowedOrigin(origin){
        if (origin && typeof origin === 'string' && origin.length > 0){
            this.options.allowedOrigin = origin;
        }
    }
    /**
     * Adds custom header to options.allowedHeaders
     * @param {string} header 
     */
    addAllowedHeader(header){
        if (header && typeof header === 'string' && header.length > 0){
            if (this.options && this.options.allowedHeaders && this.options.allowedHeaders.indexOf(header) === -1){
                this.options.allowedHeaders.push(header);
            }
        }
    }

    /**
     * Main middleware function. Must be invocked like app.use(cors.middleWare());
     * All this complex construction is needed because inside middleware function "this" is undefined.
     * That's why need to copy all class properties to local variables, define helper functions
     * inside this method and then return middleware function.
     */
    middleWare(){
        const options = this.options;
        const _checkOrigin = (origin) => {
            if (origin && origin.length > 0){
                return (this.options.allowedOrigin === '*' || this.options.allowedOrigin === origin);
            } else {
                return false;
            }
        }
        const _checkMethod = (method) => {
            return (this.options.allowedMethods.indexOf(method) > -1);
        }
        const _checkHeaders = (headers) => {
            let headersAllowed = headers.map(h => {
                return (this.options.allowedHeaders.indexOf(h.toLowerCase()) !== -1);
            });
            return (headersAllowed.indexOf(false) === -1);
        }
        const _checkIsCredentials = (h) => {
            return (h['cookie'] && h['cookie'].length > 0);
        }
        return (req, res, next) => {
            if (req.method === 'OPTIONS'){
                const method = req.headers['Access-Control-Request-Method'.toLowerCase()];
                const headers = req.headers['Access-Control-Request-Headers'.toLowerCase()].split(',');
                const origin = req.headers['origin'] || '';

                if (!_checkOrigin(origin)){
                    res.set('Access-Control-Allow-Origin', options.allowedOrigin);
                    /* 403 Forbidden
                    * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
                    */
                    return res.sendStatus(403);
                }

                if (!_checkMethod(method)){
                    res.set('Access-Control-Allow-Origin', options.allowedOrigin);
                    /* 405 Method Not Allowed
                    * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
                    */
                    return res.sendStatus(405);
                }

                if (!_checkHeaders(headers)){
                    res.set('Access-Control-Allow-Origin', options.allowedOrigin);
                    /* 406 Not Acceptable
                    * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
                    */
                    return res.sendStatus(406);            
                }
                res.set('Access-Control-Allow-Origin', options.allowedOrigin);
                res.set('Access-Control-Allow-Methods', options.allowedMethods.join(','));
                res.set('Access-Control-Allow-Headers', options.allowedHeaders.join(','));
                res.set('Access-Control-Max-Age', options.maxAge);
                return res.sendStatus(200);
            }
            if (_checkIsCredentials(req.headers)){
                if (options.allowCredentials === true){
                    res.set('Access-Control-Allow-Credentials', true);
                } else {
                    console.log(options);
                    res.set('Access-Control-Allow-Origin', options.allowedOrigin);
                    /* 403 Forbidden
                    * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
                    */
                    return res.sendStatus(403);                
                }
            }
            res.set('Access-Control-Allow-Origin', options.allowedOrigin);    
            next();
        }
    }
}

module.exports = Cors;