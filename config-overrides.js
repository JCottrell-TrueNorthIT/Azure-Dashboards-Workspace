const path = require('path');
const chokidar = require('chokidar');
const dotenv = require('dotenv');

dotenv.config({
  path: ".env.local"
});

dotenv.config({
  path: ".env"
});

module.exports = function override(config, env) {
  console.log("Using config-overrides.js");

  const dashboardDir = process.env["dashboard-path"] ?? "";
  const queriesFile = process.env["queries-file"] ?? "";

  // Add chokidar watcher for external YAML files
  const yamlFolder = path.resolve(__dirname, dashboardDir); // Adjust to your YAML folder path

  chokidar.watch(yamlFolder).on('all', (event, filePath) => {
    console.log(`Detected ${event} on file: ${filePath}`);
    const fs = require('fs');
    const emptyFile = path.resolve(__dirname, './src/_reload.js');
    fs.writeFileSync(emptyFile, `// Reload trigger: ${new Date().toISOString()}`);
  });

  const yamlQueries = path.resolve(__dirname, queriesFile);

  chokidar.watch(yamlQueries).on('all', (event, filePath) => {
    console.log(`Detected ${event} on file: ${filePath}`);
    const fs = require('fs');
    const emptyFile = path.resolve(__dirname, './src/_reload.js');
    fs.writeFileSync(emptyFile, `// Reload trigger: ${new Date().toISOString()}`);
  });

  return config;
};