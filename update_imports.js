const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace ../ imports with @/
  content = content.replace(/from '\.\.\//g, "from '@/");
  
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/screens/HomeScreen.tsx');
replaceInFile('src/screens/DetailScreen.tsx');
replaceInFile('src/screens/SettingsScreen.tsx');
replaceInFile('src/navigation/AppNavigator.tsx');
