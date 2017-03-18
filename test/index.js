var transform = require('..');

var jsx = transform({ block: 'button2', text: 'push me', icon: 'yes', content: {block: 'icon'} });

console.log(jsx.toString());
