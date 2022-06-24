const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const SITE_SOURCE = path.resolve(__dirname, '../static-site');
const SITE_TARGET = path.resolve(__dirname, '../dist');
const DB_FILE = path.resolve(__dirname, '../db/blacklist.yaml');
const IMAGE_DEFINITIONS = path.resolve(__dirname, '../db/images.yaml');
const JSON_FILE = path.resolve(__dirname, '../dist/blacklist.json');

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.log(`====== Hiba a JSON file generálásakor ======`);
    console.error(err)
  }
}

const createStaticSite = () => {
  if (!fs.existsSync(SITE_TARGET)){
    fs.mkdirSync(SITE_TARGET);
  }
  fs.copy(SITE_SOURCE, SITE_TARGET, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("success!");
    }
  });
}

// Copy static files
try {
  createStaticSite();
} catch (e) {
  console.log(`====== Hiba a generalasakor ======`);
  console.log(e);
}

// Generate API
try {
  const doc = yaml.load(fs.readFileSync(DB_FILE, 'utf8'));
  const images = yaml.load(fs.readFileSync(IMAGE_DEFINITIONS, 'utf8'));

  const imageMap = {};
  images.forEach(image => {
    imageMap[image.name] = image.url;
  });

  const db = doc.map(entry => {
    entry.image = imageMap[entry.image];
    return entry;
  });
  storeData(db, JSON_FILE);
} catch (e) {
  console.log(`====== Hiba a YAML file betöltése közben: ${DB_FILE} ======`);
  console.log(e);
}
