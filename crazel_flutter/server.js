const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

// Step 1: API endpoint to compile Dart code
app.post('/api/compile-dart', (req, res) => {
  const { code, appName } = req.body;
  
  // Define paths
  const projectPath = path.join(__dirname, 'temp_projects', appName);
  const mainDartPath = path.join(projectPath, 'lib', 'main.dart');

  // Step 2: Create Flutter project if it doesn't exist
  if (!fs.existsSync(projectPath)) {
    exec(`flutter create ${projectPath}`, (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Error creating Flutter project' });
      }
      console.log('Flutter project created.');
      writeDartFileAndBuild(res, code, mainDartPath, projectPath);
    });
  } else {
    writeDartFileAndBuild(res, code, mainDartPath, projectPath);
  }
});

// Step 3: Write Dart code and build Flutter web project
function writeDartFileAndBuild(res, code, mainDartPath, projectPath) {
  fs.writeFile(mainDartPath, code, (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error writing Dart code' });
    }
    console.log('Dart code written.');

    // Step 4: Build the Flutter web project
    exec(`flutter build web --release --web-renderer html --target ${mainDartPath}`, { cwd: projectPath }, (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Error building Flutter project' });
      }
      console.log('Flutter project built.');
      
      const compiledUrl = `http://localhost:${PORT}/compiled/${appName}`;
      res.json({ success: true, compiledUrl });
    });
  });
}

// Step 5: Serve the compiled Flutter web project
app.use('/compiled', express.static(path.join(__dirname, 'temp_projects')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
