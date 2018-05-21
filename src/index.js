import VideoBox from './video-box';

if(!window.taco) throw new Error('Taco is not defined');
const taco = window.taco;

const EXTENSION_NAME = 'taco-video-box';

function define(name, element) {
    customElements.define(name, element);
}

define("video-box", VideoBox);

taco[EXTENSION_NAME] = {
    //All the extension functions go here
};

