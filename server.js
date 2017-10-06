var express = require('express');
var webpack = require('webpack');
var devServer = require('webpack-dev-middleware');
var hotServer = require('webpack-hot-middleware');
var fs = require('fs');

var app = express();

var configFileContents = fs.readFileSync('./appConfig.js', 'utf-8');

var applyStaticRoutes = function (app) {
    app.get('/appConfig.js', function (request, response) {
        response.send(configFileContents)
    });
}

if (process.env.npm_lifecycle_event === 'start') {
    var webpackConfig = require('./webpack.config.js');
    var compiler = webpack(webpackConfig);

    const CONTENT_TYPE_HTML = "text/html";

    app.use(function (req, res, next) {
        if (req.headers.accept && req.headers.accept.substr(0, CONTENT_TYPE_HTML.length) === CONTENT_TYPE_HTML) {
            req.url = '/index.html';
        }
        next();
    });

    app.use(devServer(compiler, {
        stats: { colors: true },
        historyApiFallback: true
    }));
    app.use(hotServer(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));

    applyStaticRoutes(app);
}
else {
    app.use(express.static(__dirname + '/build'));

    // handle every other route with index.html, which will contain
    // a script tag to your application's JavaScript file(s).
    app.get('/*', function (request, response) {
        response.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    });

    applyStaticRoutes(app);
}

var port = 8585;
app.listen(port);

console.log('Express server running on port: ' + port);