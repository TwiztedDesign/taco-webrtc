window.taco = {};
window.taco.define = jest.fn();


test('Index.js defined and object', () => {
    require('../src/index');
    expect(window.taco.define.mock.calls.length).toBe(1);
    expect(window.taco.define.mock.calls[0][0]).toBe('video-box');
});
