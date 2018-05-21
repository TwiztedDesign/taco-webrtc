const WebRTC = require('./simplewebrtc.bundle');

export default class VideoStream extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        var html =
            '<div id="videoContainer1" class="video-container">'+
            '   <canvas class="canvas" name="jumbo1" style="width: 100%; height: 100%;"></canvas>'+
            '</div>';

        this.innerHTML = html;
        this.initStream(this.source);
    }

    disconnectedCallback() {

    }

    static get observedAttributes() {
        return ['result','mode', 'minValueX', 'minValueY', 'maxValueX', 'maxValueY', 'precision'];
    }

    attributeChangedCallback() {

    }

    initVideo(video /*,peer*/) {

        let self = this;
        // console.log('video added', peer);

        video.setAttribute('loop', '');
        video.setAttribute('autoplay', 'true');
        video.setAttribute('controls', '');
        video.setAttribute('width', '100%');
        video.setAttribute('height', '100%');

        self.videoEl = video;

        self.startDraw();
        self.webrtc.stopLocalVideo();
        video.play();
    }

    clearVideo (/*video, peer*/) { //DOSENT WORK
        // let self = this;
        // console.log('video removed ', peer);
        // let container = document.getElementById('videoContainer');
        // if (peer !== undefined) {
        //     if (peer.id == targetId || peer.strongId == targetId || peer.nickName == targetId) {
        //         self.videoEl = null;
        //         while (container.hasChildNodes())
        //             container.removeChild(container.lastChild);
        //
        //         var videoStub = document.createElement('video');
        //         container.appendChild(videoStub);
        //     }
        // }
    }

    startDraw(){
        let self = this;
        var video  = self.videoEl;
        var canvases = Array.prototype.slice.call(document.querySelectorAll('.canvas'));
        var contexts = canvases.map(function(canvas){
            var ctx = canvas.getContext('2d');
            ctx.name = canvas.getAttribute('name');
            return ctx;
        });

        contexts.forEach(function(context) {
            context.canvas.width  = context.canvas.offsetWidth;
            context.canvas.height = context.canvas.offsetHeight;
        });

        video.addEventListener('play', function(){
            self.draw(video, contexts);
        },false);
    }


    draw(video, contexts) {
        let self = this;
        contexts = Array.isArray(contexts)? contexts : [contexts];
        if(video.paused || video.ended) return false;
        contexts.forEach(function(context) {
            // if(self[context.name].visibility){
                context.drawImage(video, 0, 0, context.canvas.width, context.canvas.height);
            // }
        });
        self.canvasDrawTimeout = setTimeout(self.draw, 20, video, contexts);
    }


    initStream(url) {
        let self = this;

        // if(inController) return;

        var signalingServer = self.signalingServer || "https://rtc.medialooks.com:8889";
        var room = url.split("/")[0];
        var targetId = url.split("/")[1];

        // create webrtc connection
        if(self.webrtc){
            self.webrtc.leaveRoom();
            self.webrtc.connection.disconnect();
            self.webrtc.disconnect();
            delete self.webrtc;
        }
        self.webrtc = new WebRTC({
            target: targetId,
            url: signalingServer,
            socketio: {'force new connection':true},
            stunServer: [{urls: 'stun:stun.l.google.com:19302'}, {
                username: 'user',
                credential: 'pass',
                urls: 'turn:54.198.120.75:3478'
            }],
            localVideoEl: '',
            remoteVideosEl: '',
            autoRequestMedia: false,
            debug: false,
            detectSpeakingEvents: true,
            autoAdjustMic: false
        });

        // when it's ready, join if we got a room from the URL
        self.webrtc.on('readyToCall', function () {
            self.webrtc.setInfo('', self.webrtc.connection.connection.id, ''); // Store strongId

            if (room) {
                self.webrtc.joinRoom(room);
            }
        });

        //Handle incoming video from target peer
        self.webrtc.on('videoAdded', function (video, peer) {
            self.initVideo(video, peer);
        });

        //Handle removing video by target peer
        self.webrtc.on('videoRemoved', function (video, peer) {
            self.clearVideo(video, peer);
        });
    }

    get group() {
        return this.getAttribute("group");
    }
    get stream() {
        return this._streamId;
    }
    get source() {
        return this.getAttribute("source");
    }


    expose(){
        return {
            source  : 'source'
        };
    }

}