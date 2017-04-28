/*
* @Author: Django Wong
* @Date:   2017-04-27 17:32:25
* @Last Modified by:   Django Wong
* @Last Modified time: 2017-04-28 03:18:29
* @File Name: videojs-notations.js
*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notations = function () {
	function Notations(video, options) {
		_classCallCheck(this, Notations);

		console.info('videojs-notations.js is inited');
		video.notations = this;
		this.options = Object.assign(Notations.DefaultOptions, options);
		this.notations = [];
		this.video = video;
		this.init();
		return this;
	}

	_createClass(Notations, [{
		key: 'init',
		value: function init() {
			var video = this.video;
			this.videoWrapper = video.el();
			this.initPreviewWindow();
			video.on('timeupdate', this.onTimeupdate.bind(this));
			video.on('loadedmetadata', this.onLoadedmetadata.bind(this));
			return this;
		}
	}, {
		key: 'onTimeupdate',
		value: function onTimeupdate(event) {
			// console.info('on time update', event);
		}
	}, {
		key: 'onLoadedmetadata',
		value: function onLoadedmetadata(event) {
			this.addNotations(this.options.notations);
		}
	}, {
		key: 'initPreviewWindow',
		value: function initPreviewWindow() {
			var _this = this;

			var container = this.miniPlayerContainer = document.createElement('div');
			var video = this.video;
			var player = video.el().querySelector('video');
			var miniPlayer = player.cloneNode(true);
			var eventHandler = miniPlayer.addEventListener ? 'addEventListener' : 'attachEvent';
			var wrapper = document.createElement('div');
			wrapper.className = 'wrapper';
			container.appendChild(wrapper);
			container.style.width = this.options.size + 'px';

			var p = document.createElement('p');
			p.className = 'vjs-notation-text';
			p.style.fontSize = this.options.fontSize + 'px';
			p.style.lineHeight = this.options.fontSize + 2 + 'px';
			wrapper.appendChild(p);

			var span = document.createElement('span');
			span.className = 'vjs-notation-time';
			span.style.fontSize = this.options.fontSize + 'px';
			wrapper.appendChild(span);

			miniPlayer.className = 'vjs-miniplayer';
			miniPlayer.removeAttribute('data-setup');
			miniPlayer.muted = true;
			container.className = 'vjs-notations-preview';
			wrapper.appendChild(miniPlayer);

			var target = video.controlBar.progressControl.el();
			target.appendChild(container);

			target[eventHandler]('mouseover', function () {
				if (_this.options.showPreviewWhenHoverOnSeekBar) {
					_this.showPreviewWindow();
				}
			}, false);

			miniPlayer[eventHandler]('seeked', function () {
				// TODO: Hide loadding animation
			});
			miniPlayer[eventHandler]('seeked', function () {
				// TODO: Hide loadding animation
			});

			target[eventHandler]('mousemove', function (event) {
				var time = _this.calculateTime(event);
				var left = _this.calculatePosition(event);
				var hhmmss = _this.formatTime(time);
				_this.setPreviewTime(hhmmss);
				container.style.left = left + 'px';
				miniPlayer.currentTime = time;
				if (!miniPlayer.playing) {
					miniPlayer.playing = true;
					try {
						miniPlayer.play();
					} catch (e) {}
				}
			}, false);

			target[eventHandler]('mouseout', function () {
				if (_this.options.showPreviewWhenHoverOnSeekBar) {
					_this.hidePreviewWindow();
				}
				if (miniPlayer.playing) {
					miniPlayer.playing = false;
					try {
						miniPlayer.pause();
					} catch (e) {}
				}
			}, false);
		}
	}, {
		key: 'showPreviewWindow',
		value: function showPreviewWindow() {
			var container = this.miniPlayerContainer;
			container.style.opacity = 1;
			container.style.display = 'block';
			return this;
		}
	}, {
		key: 'hidePreviewWindow',
		value: function hidePreviewWindow() {
			var container = this.miniPlayerContainer;
			container.style.opacity = 0;
			container.style.display = 'none';
			return this;
		}
	}, {
		key: 'setPreviewText',
		value: function setPreviewText(text) {
			var container = this.miniPlayerContainer;
			var textContainer = container.querySelector('p');
			if (textContainer) {
				textContainer.innerText = text;
			}
		}
	}, {
		key: 'setPreviewTime',
		value: function setPreviewTime(timeStr) {
			var text = timeStr;
			var vjsTimeStr = this.video.el().querySelector('.vjs-mouse-display');
			if (vjsTimeStr) {
				text = vjsTimeStr.getAttribute('data-current-time');
			}
			var container = this.miniPlayerContainer;
			var timeContainer = container.querySelector('span');
			if (timeContainer) {
				timeContainer.innerText = text;
			}
		}
	}, {
		key: 'calculateTime',
		value: function calculateTime(event) {
			var duration = this.video.duration();
			var rect = this.video.controlBar.progressControl.el().getBoundingClientRect();
			var x = event.clientX;
			var w = rect.width;
			var l = rect.left;
			return (x - l) / w * duration;
		}
	}, {
		key: 'formatTime',
		value: function formatTime(seconds) {
			var s = parseInt(seconds, 10);
			var hours = Math.floor(s / 3600);
			var minutes = Math.floor((s - hours * 3600) / 60);
			var ss = s - hours * 3600 - minutes * 60;

			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (ss < 10) {
				ss = '0' + ss;
			}
			return hours + ':' + minutes + ':' + ss;
		}
	}, {
		key: 'calculatePosition',
		value: function calculatePosition(event) {
			var mpc = this.miniPlayerContainer;
			var pc = this.video.controlBar.progressControl.el();
			var mpcRect = mpc.getBoundingClientRect();
			var pcRect = pc.getBoundingClientRect();
			var x = event.clientX;
			var l = x - pcRect.left - mpcRect.width / 2;
			l = Math.min(l, pcRect.width - mpcRect.width);
			return Math.max(l, 0);
		}
	}, {
		key: 'addNotations',
		value: function addNotations(notations) {
			var _this2 = this;

			var duration = this.video.duration();
			notations.forEach(function (notation) {
				notation.key = _this2.uuid();
				notation.position = notation.time / duration * 100;
				_this2.createDot(notation);
				_this2.notations.push(notation);
			});
		}
	}, {
		key: 'createDot',
		value: function createDot(notation) {
			var span = document.createElement('span');
			var self = this;
			span.classList.add('vjs-notation');
			span.notation = notation;
			span.setAttribute('data-key', notation.key);
			span.setAttribute('data-time', notation.time);
			span.style.position = 'absolute';
			span.style.left = notation.position + '%';

			if (this.options.dotClassName) {
				span.classList.add(this.options.dotClassName);
			}

			span.onclick = function (e) {
				var doNotJump = false;
				if (typeof self.options.onClick === 'function') {
					doNotJump = self.options.onClick(e, notation) === false;
				}
				if (!doNotJump) {
					self.video.currentTime(notation.time);
				}
			};
			this.renderDot(span);
			return span;
		}
	}, {
		key: 'renderDot',
		value: function renderDot(span) {
			var notation = span.notation;
			var self = this;
			span.onmouseover = function () {
				self.setPreviewText(notation.text);
				self.showPreviewWindow();
			};

			span.onmouseout = function () {
				self.hidePreviewWindow();
			};

			var seekBarElement = this.video.controlBar.progressControl.seekBar.el();
			seekBarElement.appendChild(span);
		}
	}, {
		key: 'reset',
		value: function reset(notations) {
			this.notations = notations;
		}
	}, {
		key: 'next',
		value: function next() {
			var currentTime = this.video.currentTime();
			var len = this.notations.length;
			for (var i = 0; i < len; i++) {
				var notation = this.notations[i];
				if (notation.time > currentTime) {
					this.video.currentTime(notation.time);
					return;
				}
			}
		}
	}, {
		key: 'prev',
		value: function prev() {
			var currentTime = this.video.currentTime();
			var len = this.notations.length;
			for (var i = 0; i < len; i++) {
				var notation = this.notations;
				if (notation.time + 0.5 < currentTime) {
					this.video.currentTime(notation.time);
					return;
				}
			}
		}
	}, {
		key: 'uuid',
		value: function uuid() {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
			});
			return uuid;
		}
	}]);

	return Notations;
}();

Notations.DefaultOptions = {
	'onHover': function onHover() {},
	'onClick': function onClick() {},
	'notations': [],
	'size': 128,
	'fontSize': 14,
	'showPreviewWhenHoverOnSeekBar': false
};

(function (videojs) {
	var register = function register(options) {
		return new Notations(this, options);
	};
	videojs.plugin('notations', register);
})(window.videojs);