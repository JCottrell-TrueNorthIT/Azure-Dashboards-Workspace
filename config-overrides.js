const path = require('path');
const chokidar = require('chokidar');

module.exports = function override(config, env) {
  console.log("Using config-overrides.js");
  // Add chokidar watcher for external YAML files
  const yamlFolder = path.resolve(__dirname, './dashboard'); // Adjust to your YAML folder path

  chokidar.watch(yamlFolder).on('all', (event, filePath) => {
    console.log(`Detected ${event} on file: ${filePath}`);
    const fs = require('fs');
    const emptyFile = path.resolve(__dirname, './src/_reload.js');
    fs.writeFileSync(emptyFile, `// Reload trigger: ${new Date().toISOString()}`);
  });

  return config;
};