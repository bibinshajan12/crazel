const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/api/compile-dart', (req, res) => {
  const dartCode = req.body.code;
  const projectPath = path.join(__dirname, 'temp_project');
  const mainDartPath = path.join(projectPath, 'lib', 'main.dart');

  // Step 1: Create a new Flutter project
  exec(`flutter create ${projectPath}`, (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error creating Flutter project' });
    }

    // Step 2: Write the Dart code into the main.dart file
    fs.writeFile(mainDartPath, dartCode, (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Error writing Dart code' });
      }

      // Step 3: Build the Flutter project for the web
      exec(`flutter build web --release --web-renderer html --target ${mainDartPath}`, { cwd: projectPath }, (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: 'Error building Flutter project' });
        }

        // Step 4: Serve the compiled app
        const compiledUrl = `http://localhost:5000/compiled/${req.body.appName}`;
        res.json({ success: true, compiledUrl });
      });
    });
  });
});

// Serve the compiled Flutter project
app.use('/compiled', express.static(path.join(__dirname, 'temp_project/build/web')));

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
