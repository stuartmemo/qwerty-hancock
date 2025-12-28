// Setup DOM element for tests
beforeEach(() => {
  // Ensure keyboard element exists
  if (!document.getElementById('keyboard')) {
    const keyboard = document.createElement('div');
    keyboard.id = 'keyboard';
    keyboard.style.width = '200px';
    keyboard.style.height = '100px';
    document.body.appendChild(keyboard);
  }
});
