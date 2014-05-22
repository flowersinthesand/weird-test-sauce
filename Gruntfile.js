var fs = require("fs");
var url = require("url");
var Mocha = require("mocha");

module.exports = function(grunt) {
    var browsers = [{
        browserName: "firefox",
        version: "19",
        platform: "XP"
    }, {
        browserName: "googlechrome",
        platform: "XP"
    }, {
        browserName: "googlechrome",
        platform: "linux"
    }, {
        browserName: "internet explorer",
        platform: "WIN8",
        version: "10"
    }];
    
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    base: "",
                    port: 9000,
                    middleware: function(connect, options, middlewares) {
                        middlewares.push(function(req, res, next) {
                            var urlObj = url.parse(req.url, true);
                            switch(urlObj.pathname) {
                            case "/start":
                                res.setHeader("content-type", "text/javascript; utf-8");
                                delete require.cache[require.resolve("./test.js")];
                                var mocha = new Mocha({grep: /sse|streamxhr/});
                                mocha.addFile("./test.js");
                                var runner = mocha.run();
                                var failedTests = [];
                                runner.on("end", function() {
                                    var mochaResults = runner.stats;
                                    mochaResults.reports = failedTests;
                                    res.end("onstart(" + JSON.stringify(JSON.stringify(mochaResults)) + ")");
                                });
                                runner.on("fail", function(test, err) {
                                    function flattenTitles(test) {
                                        var titles = [];
                                        while (test.parent.title) {
                                            titles.push(test.parent.title);
                                            test = test.parent;
                                        }
                                        return titles.reverse();
                                    };
                                    failedTests.push({name: test.title, result: false, message: err.message, stack: err.stack, titles: flattenTitles(test)});
                                });
                                break;
                            default:
                                next();
                                break;
                            }
                        });
                        return middlewares;
                    }
                }
            }
        },
        "saucelabs-mocha": {
            all: {
                options: {
                    urls: ["http://127.0.0.1:9000/test.html"],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: browsers,
                    testname: "mocha tests",
                    tags: ["master"]
                }
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-saucelabs");
    grunt.registerTask("test-local", ["connect:server:keepalive"]);
    grunt.registerTask("test", ["connect:server", "saucelabs-mocha"]);
};