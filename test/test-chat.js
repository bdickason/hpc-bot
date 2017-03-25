/* Test for lib/chat.js */

var assert = require('assert');

var chat = require('../lib/chat.js');
var strings = require('../config/strings.json');

describe('Chat parser', function() {
	it('Ignores an empty command', function() {
		var userstate = {};
		var message = "";
		var self=false;

		chat.command(userstate, message, self, function(response) {
			assert.equal(response, null);
		});
	});

	it('Ignores case on a command', function() {
		var userstate = {
			username: "bdickason"
		};
		var message = "!SoRTiNGhaT";
		var self = false;

		var _house = "muggle";
		var _response = userstate.username + strings.general.is_a + _house;	// Expected Response

		chat.command(userstate, message, self, function(response) {
			assert.equal(response, _response);
		});
	})

	describe('!sortinghat', function() {
		it('Accepts the command by itself', function() {
			var userstate = {
				username: "bdickason"
			};
			var message ="!sortinghat";
			var self=false;

			var _house = "muggle";
			var _response = userstate.username + strings.general.is_a + _house + strings.general.exclamation;	// Expected Response

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});
		});

		it('Ignores additional text on the command', function() {
			var userstate = {
				username: "bdickason"
			};
			var message ="!sortinghat test crap!";
			var self=false;

			var _house = "muggle";
			var _response = userstate.username + strings.general.is_a + _house + strings.general.exclamation;	// Expected Response

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});
		});

	});
});

