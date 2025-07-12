const fs = require('fs');
const path = require('path');

const artworksDir = path.join(__dirname, 'public/assets/paintings');
const outputFile = path.join(__dirname, 'public/assets/data.json');

const artworkFolders = fs.readdirSync(artworksDir).filter(folder =>
  fs.statSync(path.join(artworksDir, folder)).isDirectory()
);

const artworkData = artworkFolders.map(folder => {
  const folderPath = path.join(artworksDir, folder);
  const images = fs.readdirSync(folderPath).filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  const infoPath = path.join(folderPath, 'info.json');
  let info = null;
  if (fs.existsSync(infoPath)) {
    try {
      const rawData = fs.readFileSync(infoPath, 'utf-8');
      info = JSON.parse(rawData);
    } catch (err) {
      console.error(`Error parsing info.json in folder ${folder}:`, err);
    }
  }

  return {
    title: folder.replace(/[-_]/g, ' '), // prettify title
    folder,
    images,
    info
  };
});

fs.writeFileSync(outputFile, JSON.stringify(artworkData, null, 2));
console.log('✅ Artwork data.json generated successfully.');