var AM =(function(){
	var Ctx = window.AudioContext || window.webkitAudioContext;
	if( !Object.defineProperties || !XMLHttpRequest)
		return;

		function AudioManager(){
			this.ctx = Ctx && new Ctx() || null;
			this.channel = {};
		}

		AudioManager.prototype.loadList = function( list, callback, onprogress){
			var event = {
				total : 0,
				loaded : 0,
				failed : 0,
				files : [],
				onprogress : onprogress,

				onload : function( self, e){
					this.loaded++;
					this.total++;

					this.onprogress( self, e, true);

					if( this.total === this.files.length)
						this.finish();
				},

				onerror : function(){
					this.failed++;
					this.total++;
					if( this.total === this.files.length)
						this.finish();
				},

				finish : callback || function(){}
			};

			for( key in list)
				this.load( key, list[key], event, this);
		};


	AudioManager.prototype.load = function( name, url, event, am){
			var request = new XMLHttpRequest();
			request.open( 'GET', url, true);
			request.responseType = 'blob';
			event.files.push( request);

			request.onload = function( e){
				am.onloadChannel( this, e, event, am, name);
			};

			request.onprogress = function( e, end){
				event.onprogress( this, e, end);
			};

			request.onerror = event.onerror;
			request.send();
		};

	if(Ctx){
		AudioManager.prototype.onloadChannel = function( request, e, event, am, name){
			var reader = new FileReader();

	 		reader.onload = function( readEvent){
				am.ctx.decodeAudioData( readEvent.target.result, function( buffer){
					am.channel[name] = new AudioChannel( am, buffer);
					event.onload( request, e);
				},
				function(){
					event.onerror();
				});
            };

			reader.readAsArrayBuffer(request.response);
		};

		function AudioChannel( am, buffer){
			this.ctx = am.ctx;
			this.buffer = buffer;

			this.state = this.STOP;
			this.played = null;
			this.loop = false;

			this.gain = am.ctx.createGain();
			this.gain.connect( am.ctx.destination);

			this.analyser = am.ctx.createAnalyser();
			this.analyser.smoothingTimeConstant = 0.85;
			this.analyser.fftSize = 64;
			this.analyser.connect(this.gain);
			
			this.filter = am.ctx.createBiquadFilter();
			this.filter.connect( this.analyser);

			this.volume = 1;
			this.filterFreq = 22000;
			this.timer = {paused:0, offset:0};
		};

		AudioChannel.prototype = {
			STOP : 0,
			PAUSE : 1,
			PLAY : 2,

			play : function(){
				var source = this.ctx.createBufferSource();
				source.loop = this.loop;
				source.buffer = this.buffer;
				source.connect(this.filter);
				
				source.onended = function(){
					if(!this.loop)
						this.disconnect( 0);
				};

				if( this.state === this.PAUSE){
					this.timer.offset += this.ctx.currentTime -this.timer.paused;
					source.start(0, this.ctx.currentTime- this.timer.offset);

				}else{
					if(this.played !== null){
						this.played.disconnect( 0);
						this.played = null;
					}

					this.timer.offset = this.ctx.currentTime;
					source.start(0);
				}

				this.played = source;
				this.state = this.PLAY;
			},

			pause : function(){
				if( this.state !== this.PLAY)
					return;

				this.state = this.PAUSE;
				this.timer.paused = this.ctx.currentTime;
				this.played.stop( 0);
			},
			
			stop : function(){
				if( this.state === this.STOP)
					return;

				if( this.state === this.PLAY){
					this.played.stop( 0);
					this.played.disconnect( 0);
					this.played = null;
				}

				this.state = this.STOP;
				this.timer.paused = 0;
			}
		};

		Object.defineProperties( AudioChannel.prototype, {
			volume : {
				get : function(){ return this.gain.gain.value;},
				set : function( v){ this.gain.gain.value = v;}
			},
		    filterFreq : {
				get : function(){ return this.filter.frequency.value;},
				set : function( v){ this.filter.frequency.value = v;}
			},
			filterType : {
				get : function(){ return this.filter.type;},
				set : function( v){ this.filter.type = v;}
			},
			currentTime : {
				get : function(){
					switch(this.state){
						case this.PLAY:
							return this.ctx.currentTime -this.timer.offset;

						case this.PAUSE:
							return this.timer.paused -this.timer.offset;
						
						case this.STOP:
							return 0;
					}
				}
			}
		});

	}else{
		AudioManager.prototype.onloadChannel = function( request, e, event, am, name){
			var node = document.createElement( 'audio');
			node.addEventListener( 'ended', function(){
	        	this.state = this.STOP;
			}, false);
			
			var reader = new FileReader();

            reader.onload = function( readEvent){
                node.src = readEvent.target.result;
				am.channel[name] = node;
				event.onload( this, e);
            };

            node.type = request.response.type;
            node.dataset.play = "false";

            reader.readAsDataURL( request.response);
		};

		HTMLAudioElement.prototype.STOP = 0;
		HTMLAudioElement.prototype.PAUSE = 1;
		HTMLAudioElement.prototype.PLAY = 2;
		
		HTMLAudioElement.prototype._play = HTMLAudioElement.prototype.play;
		HTMLAudioElement.prototype._pause = HTMLAudioElement.prototype.pause;

        HTMLAudioElement.prototype.play = function(){
        	if(this.state === this.PLAY){
        		this.pause();
				this.currentTime = 0.0;
				this._play();

        	}else{
        		this._play();
        	}
        };

        HTMLAudioElement.prototype.pause = function(){
        	this.dataset.play = "false";
        	this.state = this.PAUSE;
        	this._pause();
        };

		HTMLAudioElement.prototype.stop = function(){
			this.pause();
        	this.state = this.STOP;
			this.currentTime = 0.0;
		};
	}

	return new AudioManager();
})();