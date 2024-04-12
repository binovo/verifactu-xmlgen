/*
 * Copyright 2019 Nazmul Idris. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Karma configuration
// Generated on Sun Jun 23 2019 11:58:21 GMT-0700 (Pacific Daylight Time)

const webpackConfig = require('./webpack.prod');
const { exec }      = require('child_process');

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/test*.ts',
            'test/test*.js',
            {
                pattern: 'test/assets/**',
                watched: false,
                included: false,
                served: true
            }],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.ts': ['webpack'],
            'test/**/*.js': ['webpack']
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
            mode: webpackConfig.mode,
            devtool: 'inline-source-map'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        beforeMiddleware: ['checkXml'],
        plugins: [
            {
                'middleware:checkXml': ['factory', function(config) {
                    const validUrls = [
                        '/tbaiCheckInvoiceXml',
                        '/tbaiCheckCancelInvoiceXml',
                        '/lroeCheckInvoice240Xml',
                        '/lroeCheckCancelInvoice240Xml',
                        '/lroeCheckInvoice140Xml',
                        '/lroeCheckCancelInvoice140Xml',
                        '/lroeCheckSsgInvoice240Xml',
                        '/lroeCheckCancelSsgInvoice240Xml',
                        '/verifactuCheckInvoiceXml',
                        '/verifactuCheckCancelInvoiceXml'
                    ];
                    return function(request, response, next) {
                        if (validUrls.includes(request.url)) {
                            response.writeHead(200);
                            var schema;
                            switch (request.url) {
                                case "/tbaiCheckCancelInvoiceXml":
                                    schema = "Anula_TicketBai.xsd";
                                    break;
                                case "/lroeCheckInvoice240Xml":
                                    schema = "LROE_PJ_240_2_FacturasRecibidas_AltaModifPeticion_V1_0_1.xsd";
                                    break;
                                case "/lroeCheckCancelInvoice240Xml":
                                    schema = "LROE_PJ_240_2_FacturasRecibidas_AnulacionPeticion_V1_0_0.xsd";
                                    break;
                                case "/lroeCheckInvoice140Xml":
                                    schema = "LROE_PF_140_2_1_Gastos_Confactura_AltaModifPeticion_V1_0_2.xsd";
                                    break;
                                case "/lroeCheckCancelInvoice140Xml":
                                    schema = "LROE_PF_140_2_1_Gastos_Confactura_AnulacionPeticion_V1_0_0.xsd";
                                    break;
                                case "/lroeCheckSsgInvoice240Xml":
                                    schema = "LROE_PJ_240_1_2_FacturasEmitidas_SinSG_AltaModifPeticion_V1_0_1.xsd";
                                    break;
                                case "/lroeCheckCancelSsgInvoice240Xml":
                                    schema = "LROE_PJ_240_1_2_FacturasEmitidas_SinSG_AnulacionPeticion_V1_0_0.xsd";
                                    break;
                                case "/verifactuCheckInvoiceXml":
                                case "/verifactuCheckCancelInvoiceXml":
                                    schema = "SuministroLR.xsd";
                                    break;
                                default:
                                    schema = "TicketBai.xsd";
                                    break;
                            }
                            var cmd = 'cd "' + __dirname + '/test/tbai_validation/schemas"; env XML_CATALOG_FILES=catalog xmllint --schema "' + schema + '" --format -';
                            const child = exec(cmd, (error, stdout, stderr) => {
                                if (error) {
                                    response.end(stderr);
                                } else {
                                    response.end('ok');
                                }
                            });
                            request.on('data', (data) => child.stdin.write(data));
                            request.on('end', () => child.stdin.end());
                        } else {
                            next();
                        }
                    };
                }]
            },
            'karma-*'
        ]
    });
};
