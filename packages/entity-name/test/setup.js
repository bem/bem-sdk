// Silence DeprecationWarning during tests
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning') return;
});
