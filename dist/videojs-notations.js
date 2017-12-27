/*
* @Author: Django Wong
* @Date:   2017-04-27 17:32:25
* @Last Modified by:   django-wong
* @Last Modified time: 2017-12-27 16:31:43
* @File Name: videojs-notations.js
*/

'use strict';

class Notations {
	constructor(video, options) {
		console.info('videojs-notations.js is inited');
		this.options = Object.assign(Notations.DefaultOptions, options);
		this.notations = [];
		this.video = video;
		this.init();
		return this;
	}

	init() {
		var video = this.video;
		this.videoWrapper = video.el();
		this.initPreviewWindow();
		video.on('timeupdate', this.onTimeupdate.bind(this));
		video.on('loadedmetadata', this.onLoadedmetadata.bind(this));
		return this;
	}

	onTimeupdate(event) {
		// console.info('on time update', event);
	}

	onLoadedmetadata(event) {
		this.addNotations(this.options.notations);
	}

	initPreviewWindow() {
		var container = this.miniPlayerContainer = document.createElement('div');
		var video = this.video;
		var player = video.el().querySelector('video');
		var miniPlayer = player.cloneNode(true);
		var eventHandler = miniPlayer.addEventListener ? 'addEventListener' : 'attachEvent';
		var wrapper = document.createElement('div');
		wrapper.className = 'wrapper';
		container.appendChild(wrapper);
		container.style.width = `${this.options.size}px`;

		var p = document.createElement('p');
		p.className = 'vjs-notation-text';
		p.style.fontSize = `${this.options.fontSize}px`;
		p.style.lineHeight = `${this.options.fontSize + 2}px`;
		wrapper.appendChild(p);

		var span = document.createElement('span');
		span.className = 'vjs-notation-time';
		span.style.fontSize = `${this.options.fontSize}px`;
		wrapper.appendChild(span);

		miniPlayer.className = 'vjs-miniplayer';
		miniPlayer.removeAttribute('data-setup');
		miniPlayer.muted = true;
		container.className = 'vjs-notations-preview';
		wrapper.appendChild(miniPlayer);

		let target = video.controlBar.progressControl.el();
		target.appendChild(container);

		target[eventHandler]('mouseover', () => {
			if (this.options.showPreviewWhenHoverOnSeekBar) {
				this.showPreviewWindow();
			}
		}, false);

		miniPlayer[eventHandler]('seeked', () => {
			// TODO: Hide loadding animation
		});
		miniPlayer[eventHandler]('seeked', () => {
			// TODO: Hide loadding animation
		});

		target[eventHandler]('mousemove', event => {
			var time = this.calculateTime(event);
			var left = this.calculatePosition(event);
			var hhmmss = this.formatTime(time);
			this.setPreviewTime(hhmmss);
			container.style.left = `${left}px`;
			miniPlayer.currentTime = time;
			if (!miniPlayer.playing) {
				miniPlayer.playing = true;
				try {
					miniPlayer.play();
				} catch (e) {}
			}
		}, false);

		target[eventHandler]('mouseout', () => {
			if (this.options.showPreviewWhenHoverOnSeekBar) {
				this.hidePreviewWindow();
			}
			if (miniPlayer.playing) {
				miniPlayer.playing = false;
				try {
					miniPlayer.pause();
				} catch (e) {}
			}
		}, false);
	}

	showPreviewWindow() {
		var container = this.miniPlayerContainer;
		container.style.opacity = 1;
		container.style.display = 'block';
		return this;
	}

	hidePreviewWindow() {
		var container = this.miniPlayerContainer;
		container.style.opacity = 0;
		container.style.display = 'none';
		return this;
	}

	setPreviewText(text) {
		var container = this.miniPlayerContainer;
		var textContainer = container.querySelector('p');
		if (textContainer) {
			textContainer.innerText = text;
		}
	}

	setPreviewTime(timeStr) {
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

	calculateTime(event) {
		var duration = this.video.duration();
		var rect = this.video.controlBar.progressControl.el().getBoundingClientRect();
		var x = event.clientX;
		var w = rect.width;
		var l = rect.left;
		return (x - l) / w * duration;
	}

	formatTime(seconds) {
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

	calculatePosition(event) {
		var mpc = this.miniPlayerContainer;
		var pc = this.video.controlBar.progressControl.el();
		var mpcRect = mpc.getBoundingClientRect();
		var pcRect = pc.getBoundingClientRect();
		var x = event.clientX;
		var l = x - pcRect.left - mpcRect.width / 2;
		l = Math.min(l, pcRect.width - mpcRect.width);
		return Math.max(l, 0);
	}

	addNotations(notations) {
		let duration = this.video.duration();
		notations.forEach(notation => {
			notation.key = this.uuid();
			notation.position = notation.time / duration * 100;
			this.createDot(notation);
			this.notations.push(notation);
		});
	}

	createDot(notation) {
		var span = document.createElement('span');
		var self = this;
		span.classList.add('vjs-notation');
		span.notation = notation;
		span.setAttribute('data-key', notation.key);
		span.setAttribute('data-time', notation.time);
		span.style.position = 'absolute';
		span.style.left = `${notation.position}%`;

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

	renderDot(span) {
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

	reset(notations) {
		this.notations = notations;
	}

	next() {
		var currentTime = this.video.currentTime();
		let len = this.notations.length;
		for (var i = 0; i < len; i++) {
			let notation = this.notations[i];
			if (notation.time > currentTime) {
				this.video.currentTime(notation.time);
				return;
			}
		}
	}

	prev() {
		var currentTime = this.video.currentTime();
		let len = this.notations.length;
		for (var i = 0; i < len; i++) {
			let notation = this.notations;
			if (notation.time + 0.5 < currentTime) {
				this.video.currentTime(notation.time);
				return;
			}
		}
	}

	uuid() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
		});
		return uuid;
	}
}

Notations.DefaultOptions = {
	'onHover': function () {},
	'onClick': function () {},
	'notations': [],
	'size': 128,
	'fontSize': 14,
	'showPreviewWhenHoverOnSeekBar': false
};

(function (videojs) {
	let register = function (options) {
		return new Notations(this, options);
	};
	videojs.plugin('notations', register);
})(window.videojs);