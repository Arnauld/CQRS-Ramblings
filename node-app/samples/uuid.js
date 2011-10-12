var child_process = require('child_process');
var uuid = child_process.exec("uuidgen");
uuid.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});
