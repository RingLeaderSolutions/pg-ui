var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var fs = require('fs');
var path = require("path");
var app = express();
var dotenv = require('dotenv');
var configSubstitutor = require('./config/ConfigSubstitutor');

// Constants
const configDirectory = "../../config";
const appConfigPath = path.resolve(__dirname, configDirectory, "appConfig.js");
const CONTENT_TYPE_HTML = "text/html";

// Defaults
const defaultPort = 8585;
const defaultTPIFlowEnvironment = "development";

const log = function(severity, message) {
    console.log(`[tpiflow_server]: [${severity}] - ${message}`);
}

// -- [Startup] Step 1: Check and set expected environment variables 
var nodeVersion = process.version;
var tpiEnv = process.env.TPIFLOW_ENV;
var lifecycleEvent = process.env.npm_lifecycle_event;
var port = process.env.PORT;
log("INFO", `Initialising server: [NODE_VERSION: ${nodeVersion}] [NPM_LIFECYCLE_EVENT: ${lifecycleEvent}] [TPIFLOW_ENV: ${tpiEnv}] [PORT: ${port}]`);

if(tpiEnv == null){
    log("WARNING", `Warning: No [TPIFLOW_ENV] variable set. Defaulting to [${defaultTPIFlowEnvironment}]`);    
    tpiEnv = defaultTPIFlowEnvironment;
}

if(port == null){
    log("WARNING", `Warning: No [PORT] set. Defaulting to [${defaultPort}]`);    
    port = defaultPort;
}

// -- [Startup] Step 2: Select config.env file, if it exists
var configFile = `config.${tpiEnv}.env`;
var absoluteEnvPath = path.resolve(__dirname, configDirectory, configFile);
if (fs.existsSync(absoluteEnvPath)) {
    log("INFO", `Found configuration file for [${tpiEnv}]. Setting environment variables contained in [${absoluteEnvPath}]`);
    dotenv.config({ path: absoluteEnvPath });
}
else {
    log("WARNING", `Using process environment variables - no configuration file was found for [${tpiEnv}] at [${absoluteEnvPath}].`);
}

// -- [Startup] Step 3: Load appConfig.js and rewrite it in-memory to contain environment variable values
var configFileContents = fs.readFileSync(appConfigPath, 'utf-8');
configFileContents = configSubstitutor(configFileContents);

log("INFO", `Successfully substituted appConfig variables`);

// -- [Startup] Step 4: Apply express route exception for appConfig.js
app.get('/appConfig.js', function (request, response) {
    response.send(configFileContents)
});
log("INFO", `Applied express route exception for appConfig.`);

// -- [Startup] Step 5: Setup express routing, with debug info if necessary
if (lifecycleEvent == "debug") {
    log("WARNING", `Debug mode detected: setting up dev & hot server with HMR enabled`);

    app.use(function (req, res, next) {
        if (req.headers.accept && req.headers.accept.substr(0, CONTENT_TYPE_HTML.length) === CONTENT_TYPE_HTML) {
            req.url = '/index.html';
        }
        next();
    });

    var webpackConfig = require('../app/webpack.config.js');
    var compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        stats: { colors: true },
        historyApiFallback: true
    }));

    const hmrLog = function(message){
        console.log(`[tpiflow_server_hmr]: ${message}`);
    }

    app.use(webpackHotMiddleware(compiler, {
        log: hmrLog, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
}
else {
    var buildDirectory = path.resolve(__dirname, "../../build");
    log("WARNING", `Standard mode detected, setting up static routes for files in [${buildDirectory}]`);
    app.use(express.static(buildDirectory));

    var appEntry = path.resolve(buildDirectory, 'index.html');
    log("WARNING", `Setting up route for [/*] to [${appEntry}]`);
    app.get('/*', function (request, response) {
        response.sendFile(appEntry)
    });
}

app.listen(port);
log("INFO", `Initialisation complete, server running.`);