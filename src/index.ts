import axios from 'axios';
import { parseItem } from './utils/parseItem';
import download from './utils/download';
import Item from './models/ItemModel';
import saveToJson from './utils/saveToJson';
import { argv } from 'yargs';

const versionPaths = {
  url: '/cdragon/tft/en_us.json',
  version: '/code-metadata.json'
}

const url = 'https://raw.communitydragon.org/';
const version = argv.dataversion || 'latest';

console.log('Using version', version);

const versionUrl = `${url}${version}${versionPaths.version}`
const dataUrl = `${url}${version}${versionPaths.url}`

const getData = async() => await axios.get(dataUrl);
const getVersion = async() => await axios.get(versionUrl)
  .then(({ data }) => {
    const { version } = data;
    return version.substr(0, version.indexOf('.', version.indexOf('.') + 1));
  });

(async () => {
  let version, data;
  try {
    version = await getVersion();
    const { data: _data } = await getData();
    data = _data;
  } catch(e) {
    console.log(e);
    return;
  }

  const { items, sets } = data;
  const iconUrls = [];
  const parsedItems = [];
  const testItems = [];
  const errorItems = [];

  items.forEach((item: any, index: number) => {
    if (
      (item.id <= 0) // negative ids are not real items. idk what htey are.
      || (item.from.length === 0 && item.id >= 100)
    ) {
      testItems.push(item);
      return;
    };
    const parsedItem = parseItem(item, index, (item) => {
      const iconUrl = 'http://raw.communitydragon.org/latest/game/' + item.icon.replace('.dds', '.png').toLowerCase();
      item.icon = iconUrl.substring(iconUrl.lastIndexOf('/')+1);
      iconUrls.push(iconUrl);
      return item;
    });
    if (parsedItem.error) {
      errorItems.push(parsedItem)
      return;
    }
    parsedItems.push(parsedItem);
  });

  if (errorItems.length) {
    console.error(errorItems.length + ' errors');
    errorItems.forEach(({ name, id }) => console.error({ id, name }));
  }

  const basicItems = [];
  const advancedItems = [];

  parsedItems.forEach((item) => {
    if (item.from.length === 0) {
      basicItems.push(item);
    } else if (item.from.length === 2) {
      advancedItems.push(item);
    } else {
      errorItems.push(item)
    }
  });

  const itemsToJson = {
    version,
    data: {
      basicItems,
      advancedItems
    }
  };

  saveToJson({ filePath: './test.json', object: itemsToJson });
})();

