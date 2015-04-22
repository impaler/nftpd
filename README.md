Quick FTP daemon
================
nftpd (short for Node FTPd) is a quick FTP daemon you can fire up for
developing, testing or sharing stuff quickly. It's a command-line frontend to
[nodeftpd](https://github.com/sstur/nodeftpd/) and isn't intended as a
production thing.

Usage
-----

To fire up an anonymous FTP server in the current folder, run
`node /path/to/index.js`.

Note that this is a full-on server, with write and delete access.

```
  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -u, --user [username]  Specify a username (default 'anonymous')
    -p, --pass [password]  Specify a password (default blank)
    -n, --port [number]    Port number to use. (default 2121)
    -d, --dir [root]       Root directory (default cwd)
```
