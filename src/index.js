import VideoStream from './video-stream';

if(!window.taco) throw new Error('Taco is not defined');
const taco = window.taco;

const EXTENSION_NAME = 'taco-webrtc';

function define(name, element) {
    customElements.define(name, element);
}

define("video-stream", VideoStream);

taco[EXTENSION_NAME] = {
    //All the extension functions go here
};

