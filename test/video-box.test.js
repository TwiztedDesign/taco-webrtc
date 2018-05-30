import VideoBox from '../src/video-box';
jest.mock('../src/video-box');

beforeEach(() => {
    VideoBox.mockClear();
});


test('dummy test', () => {
    expect(true).toBe(true);
});
