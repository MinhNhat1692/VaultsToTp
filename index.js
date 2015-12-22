var Crypto = require('crypto');

module.exports = VaultToTp;

function VaultToTp(options) {
	options = options || {};
	this.secret = options.secret;
}

VaultToTp.prototype.GetCode = function() {
	secret = bufferizeSecret(this.secret);
	var time = Math.floor(Date.now() / 1000);
	var buffer = new Buffer(8);
	buffer.writeUInt32BE(0, 0);
	buffer.writeUInt32BE(Math.floor(time / 30), 4);
	var hmac = Crypto.createHmac('sha1', secret);
	hmac = hmac.update(buffer).digest();
	var start = hmac[19] & 0x0F;
	hmac = hmac.slice(start, start + 4);
	var fullcode = hmac.readUInt32BE(0) & 0x7fffffff;
	var chars = '23456789BCDFGHJKMNPQRTVWXY';
	var code = '';
	for(var i = 0; i < 5; i++) {
		code += chars.charAt(fullcode % chars.length);
		fullcode /= chars.length;
	}
	return code;
};

VaultToTp.prototype.GetTimeLeft = function() {
	var time = Math.floor(Date.now() / 1000);
	console.log(time);
	console.log(Math.floor(time / 30), 4);
	return code;
};

function bufferizeSecret(secret) {
	if(typeof secret === 'string') {
		if(secret.match(/[0-9a-f]{40}/i)) {
			return new Buffer(secret, 'hex');
		} else {
			return new Buffer(secret, 'base64');
		}
	}
	return secret;
}
