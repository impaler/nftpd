#!/usr/bin/node
var ftpd = require('ftpd');
var fs = require('fs');
var program = require('commander');
var pkg = require(__dirname+'/package.json');
var HR = Array(60).join('*');
process.title = 'nftpd';

program
	.version(pkg.version)
	.option('-u, --user [username]', 'Specify a username (default "anonymous")')
	.option('-p, --pass [password]', 'Specify a password (default blank)')
	.option('-n, --port [number]', 'Port number to use. (default 2121)')
	.option('-d, --dir [root]', 'Root directory (default cwd)')
	.parse(process.argv);

var root = program.dir || process.cwd();
program.user = program.user || 'anonymous';
program.port = program.port || 2121;

console.log(HR);
console.log(pkg.name, 'v'+pkg.version);
console.log('Root: ' + root);

if(program.user === 'anonymous'){
	console.log('Anonymous access: careful, write access is allowed.');
} else {
	console.log('Password access. User: '+ program.user+ ', password: '+
	String(program.pass).replace(/./g,'*'));
}
console.log(HR);

var options = {
	pasvPortRangeStart: 4000,
	pasvPortRangeEnd: 5000,
	useWriteFile: false,
	logLevel: 2,
	getInitialCwd: function(connection, callback) {
		callback(null, '/');
	},
	getRoot: function(user) {
		return root;
	}
};

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	var server = new ftpd.FtpServer(add, options);

	server.on('client:connected', function(conn) {
		var username;
		var addr = conn.socket.remoteAddress;
		console.log(addr, 'Client connected');
		conn.on('command:user', function(user, success, failure) {
			(user == program.user) ? success(): failure();
		});
		conn.on('command:pass', function(pass, success, failure) {
			// check the password
			if(program.user === 'anonymous'){
				console.log(addr, 'Anonymous access granted.');
				success(program.user);
			} else {
				if(pass == program.pass){
				console.log(addr, 'Access granted for ', program.user);
				success(program.user);
				} else {
				console.log(addr, 'Access denied for ', program.user);
				failure()
				}
			}
		});
	});

	server.listen(program.port);

	console.log('ftpd listening on ftp://'+add+':'+program.port);
});
