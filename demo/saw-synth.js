var context = new webkitAudioContext(),
    oscillator = context.createOscillator(),
    gainNode = context.createGainNode();

oscillator.type = 2;
oscillator.frequency.value = 500;
oscillator.connect(gainNode);
gainNode.connect(context.destination);
