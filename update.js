const exec = require('child_process').exec
exec('node ./procImage.js', function (error, stdout, stderr) {
    if (stdout.length > 1) {
        console.log('stdout : ' + stdout);
    }
    if (error || stderr) {
        console.info('stderr : ' + stderr);
    } else {
        exec('git add .', function (error, stdout, stderr) {
            if (stdout.length > 1) {
                console.log('stdout : ' + stdout);
            }
            if (error) {
                console.info('stderr : ' + stderr);
            }
        });
    }
});