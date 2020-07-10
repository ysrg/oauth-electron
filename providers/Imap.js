const fs = require('fs');
const path = require('path');
const imaps = require('imap-simple');

class Imap {
  constructor(password, user, host, port) {
    this.user = user;
    this.xoauth2 = password;
    // this.xoauth2 = password
    this.host = host;
    this.port = port;
  }

	connect = () => {
	  imaps.connect(
	    {
	      imap:
			{
			  // user: 'sarancha090@gmail.com',
			  user: 'sergiu01@hotmail.com',
			  xoauth2: Buffer.from(`user=sergiu01@hotmail.com\x01auth=Bearer ${this.xoauth2}\x01\x01`).toString('base64'),
			  host: this.host,
			  authTimeout: 30000,
			  port: this.port,
			  tls: true,
			  tlsOptions: { servername: this.host },
			},
	    },
	  ).then((connection) => connection.openBox('INBOX').then(() => {
	    const searchCriteria = [
	      'UNSEEN',
	    ];

	    const fetchOptions = {
	      bodies: ['HEADER', 'TEXT'],
	      markSeen: false,
	    };

	    return connection.search(searchCriteria, fetchOptions).then((results) => {
	      const subjects = results.map((res) => res.parts.filter((part) => part.which === 'HEADER')[0].body.subject[0]);

	      console.log('++++', subjects);
	      // =>
	      //   [ 'Hey Chad, long time no see!',
	      //     'Your amazon.com monthly statement',
	      //     'Hacker Newsletter Issue #445' ]
	    });
	  }));
	}
}

module.exports = Imap;
