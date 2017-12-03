class Noise {
  constructor() {
    const BudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new BudioContext();

    this.sources = ["assets/5.mp3", "assets/6.mp3", "assets/7.wav",
      "assets/8.mp3", "assets/9.mp3", "assets/10.mp3", "assets/11.mp3",
      "assets/12.mp3", "assets/13.mp3", "assets/14.mp3"];
    this.buffers = [];
  }
  loadFirst() {
    return new Promise((resolve, reject) => {
      this.loadSample(this.sources[0]).then((buffer) => {
        this.buffers.push(buffer);
        this.loadNext();
        resolve(true);
      }).catch(err => (reject(err)));
    });
  }
  // load next source into its buffer
  loadNext() {
    const i = this.buffers.length - 1;
    if (this.sources.length > this.buffers.length) {
      console.log(`loading ${this.sources[i]} ${this.buffers.length}/${this.sources.length}`);
      this.loadSample(this.sources[i]).then((buffer) => {
        this.buffers.push(buffer);
        this.loadNext();
      });
    }
  }
  loadSample(url) {
    return fetch(url).then(response => // fetch is natively a promise
      response.arrayBuffer()).then(audioData => new Promise((resolve, reject) => {
      // FIXME: something is wrong with Safari on this
      this.context.decodeAudioData(audioData, (buffer) => {
        resolve(buffer);
      }).catch(err => (reject(err)));
    }));
  }
  play() {
    this.player = this.context.createBufferSource();
    this.player.loop = false;
    this.player.connect(this.context.destination);

    const i = Math.floor(Math.random() * this.buffers.length);
    console.log(`playing ${this.sources[i]} ${i}/${this.buffers.length}`);
    this.player.buffer = this.buffers[i];
    this.player.start();
  }
  stop() {
    this.player.stop();
  }
}

export default Noise;
