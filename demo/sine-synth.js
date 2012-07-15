var context = new webkitAudioContext(),
    sineWave = context.createOscillator(),
    gainNode = context.createGainNode();

sineWave.connect(gainNode);
gainNode.connect(context.destination);

sineWave.noteOn(0);
gainNode.gain.value = 0;
