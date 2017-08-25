#!/usr/bin/env node
/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var eventbus = require('./lib/eventbus'); // Global event bus that modules can pub/sub to

// Initialize Twitch connection
var tmi = require("tmi.js");	// Initialize tmi.js here so we can inject it during testing
var twitchConfig = require("./lib/twitch/config/tmi-options.js");
var twitchClient = new tmi.client(twitchConfig.options);
twitchClient.connect();

// Initialize Mixpanel for logging
var Mixpanel = require('mixpanel');
var mixpanelConfig = require('./config/mixpanel-options.js');

var mixpanel;
if(mixpanelConfig.options) {
	mixpanel = Mixpanel.init(mixpanelConfig.options);
}
mixpanel.channel = twitchConfig.options.channels[0];

var Twitch = require('./lib/twitch');
Twitch.start(eventbus, twitchClient, twitchConfig.options.channels[0]);

// Load Models
var db = require('./lib/db');
db.connect();

var User = require('./lib/models/user');
User.start(db, mixpanel);

var Channel = require('./lib/models/channel');
Channel.start(db, eventbus);

var Team = require('./lib/models/team');
Team.start(db, mixpanel);

// Bot modules
var Chat = require ('./lib/chat');
Chat.start(eventbus, mixpanel);

var Overlays = require('twitch-overlay');
// var Overlays = require('../twitch-overlay');
Overlays.start({events: eventbus});

/* Setup Bot Commands */
var commands = [];

// Message on Join
var Join = require('./lib/commands/join');
Join.start(eventbus, User);
commands.push(Join);

// !setcommends / !commends
var Commends = require('./lib/commands/commends');
Commends.start(eventbus, User);
commands.push(Commends);

// !rules
var Rules = require('./lib/commands/rules');
Rules.start(eventbus);
commands.push(Rules);

// !house / !sortinghat
var House = require('./lib/commands/house');
House.start(eventbus, User);
commands.push(House);

// !status
var Status = require('./lib/commands/status');
Status.start(eventbus, User);
commands.push(Status);

// !dice / !coin
var Random = require('./lib/commands/random');
Random.start(eventbus);
commands.push(Random);

// !cup
var Housecup = require('./lib/commands/housecup');
Housecup.start(eventbus, Team);
commands.push(Housecup);


// Add video overlay commands
var videoOverlay = require('twitch-overlay-video');
// var videoOverlay = require('../twitch-overlay-video');

/* Events */

// !powermove
var Powermove = new videoOverlay({
	trigger: "powermove",
	eventbus: eventbus,
	video: "lib/overlays/events/powermove.mp4"
});
commands.push(Powermove);

// !2rnb
var Tworax = new videoOverlay({
	trigger: "tworax",
	eventbus: eventbus,
	video: "lib/overlays/events/tworax.mp4"
});
commands.push(Tworax);

// !hpcwins
var Hpcwins = new videoOverlay({
	trigger: "hpcwins",
	eventbus: eventbus,
	video: "lib/overlays/events/hpcwins.mp4"
});
commands.push(Hpcwins);

// !gift
var Gift = new videoOverlay({
	trigger: "gift",
	eventbus: eventbus,
	video: "lib/overlays/events/gift.mp4"
});
commands.push(Gift);

// !cheese
var Cheese = new videoOverlay({
	trigger: "cheese",
	eventbus: eventbus,
	video: "lib/overlays/events/cheese.mp4"
});
commands.push(Cheese);

// !smoke
var Smoke = new videoOverlay({
	trigger: "smoke",
	eventbus: eventbus,
	video: "lib/overlays/events/smokegank.mp4"
});
commands.push(Smoke);


// !muggle
var Muggle = new videoOverlay({
	trigger: "muggle",
	eventbus: eventbus,
	video: "lib/overlays/events/muggle.mp4"
});
commands.push(Muggle);

// !sac
var Sacrifice = new videoOverlay({
	trigger: "sac",
	eventbus: eventbus,
	video: "lib/overlays/events/sacrifice.mp4"
});
commands.push(Sacrifice);

// !first
var Firstblood = new videoOverlay({
	trigger: "first",
	eventbus: eventbus,
	video: "lib/overlays/events/Firstblood.mp4"
});
commands.push(Firstblood);

// !Buyback
var Buyback = new videoOverlay({
	trigger: "buyback",
	eventbus: eventbus,
	video: "lib/overlays/events/Buyback.mp4"
});
commands.push(Buyback);

// !open
// should be fullscreen
var Opening = new videoOverlay({
	trigger: "open",
	eventbus: eventbus,
	video: "lib/overlays/events/Opening.mp4"
});
commands.push(Opening);

// !close
// should be fullscreen
var Closing = new videoOverlay({
	trigger: "close",
	eventbus: eventbus,
	video: "lib/overlays/events/Closing.mp4"
});
commands.push(Closing);


/* Fake Ads */

// !kia
// should be fullscreen
var Kia = new videoOverlay({
	trigger: "kia",
	eventbus: eventbus,
	video: "lib/overlays/ads/kia.mp4"
});
commands.push(Kia);

// !monster
// should be fullscreen
var Monster = new videoOverlay({
	trigger: "monster",
	eventbus: eventbus,
	video: "lib/overlays/ads/monster.mp4"
});
commands.push(Monster);

// !polo
// should be fullscreen
var Polo = new videoOverlay({
	trigger: "polo",
	eventbus: eventbus,
	video: "lib/overlays/ads/Polo.mp4"
});
commands.push(Polo);


// !text (External module)
var Text = require('twitch-overlay-text');
// var Text = require('../twitch-overlay-text');
Text.start(eventbus);
commands.push(Text);

/* Load chat triggers and stream overlays */
commands.forEach(function(command) {
	// Start listening for chat triggers

	if(command.triggers && (command.triggers.length > 0)) {
		Chat.addTriggers(command.triggers);
	}

	// Initialize individual overlays
	if(command.overlay) {
		Overlays.add(command.overlay);
	}
});

// Sound board - Trigger overlays from a web-based UI

var soundboard = require('./lib/twitch-soundboard');
soundboard.start({events: eventbus});
