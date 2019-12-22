import axios from 'axios';
import { parseItem } from './utils/parseItem';
import download from './utils/download';
import Item from './models/ItemModel';
import saveToJson from './utils/saveToJson';

const latestDataUrl = 'http://raw.communitydragon.org/latest/cdragon/tft/en_us.json';
const pbeDataUrl = 'https://raw.communitydragon.org/pbe/cdragon/tft/en_us.json';
const fakeUrl = 'https://raw.communitydragon.org/pbe/cdragon/tft/en_us.jsons'

// const getData = async() => await axios.get(latestDataUrl);
const data = require('./en_us.json');
const getData = async() => await Promise.resolve({ data });

(async () => {
  const { data } = await getData();
  const { items, sets } = data;

  const iconUrls = [];
  const newItems = [];
  // idk what these items are;
  const testItems = []
  items.forEach((item: Item, index: number) => {
    if (
      (item.id <= 0) // negative ids are not real items. idk what htey are.
      || (item.from.length === 0 && item.id >= 100)
    ) {
      testItems.push(item);
      return;
    };
    const newItem = parseItem(item, index, (newItem) => {
      const iconUrl = 'http://raw.communitydragon.org/latest/game/' + item.icon.replace('.dds', '.png').toLowerCase();
      newItem.icon = iconUrl.substring(iconUrl.lastIndexOf('/')+1);
      iconUrls.push(iconUrl);
      return newItem;
    });
    newItems.push(newItem);
  });


  const basicItems = [];
  const advancedItems = [];

  newItems.forEach((item) => {
    if (item.from.length === 0) {
      basicItems.push(item);
    } else if (item.from.length === 2) {
      advancedItems.push(item);
    } else {
      throw item;
    }
  });

  const itemsToJson = {
    basicItems,
    advancedItems
  };
  saveToJson({ filePath: './test.json', object: itemsToJson });
})();

