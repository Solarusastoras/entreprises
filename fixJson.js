const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('entreprises.json', 'utf8'));
  
  if (Array.isArray(data)) {
    const wrappedData = {
      entreprises: data
    };
    fs.writeFileSync('entreprises.json', JSON.stringify(wrappedData, null, 2));
    console.log("JSON wrap successful!");
  } else {
    console.log("JSON is already wrapped in an object.");
  }
} catch(e) {
  console.error("Error modifying JSON:", e);
}
