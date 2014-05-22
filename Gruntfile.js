module.exports = function(grunt) {
    var browsers = [{
        browserName: "firefox",
        version: "19",
        platform: "XP"
    }, {
        browserName: "googlechrome",
        platform: "XP"
    }, {
        browserName: "internet explorer",
        platform: "XP",
        version: "6"
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
                    port: 9000
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
    grunt.registerTask("test", ["connect:server", "saucelabs-mocha"]);
};