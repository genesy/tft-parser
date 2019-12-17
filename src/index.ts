import axios from 'axios';
import { parseItem } from './utils/parseItem';
import download from './utils/download';
import Item from './models/ItemModel';


const latestDataUrl = 'http://raw.communitydragon.org/latest/cdragon/tft/en_us.json';
const pbeDataUrl = 'https://raw.communitydragon.org/pbe/cdragon/tft/en_us.json';
const fakeUrl = 'https://raw.communitydragon.org/pbe/cdragon/tft/en_us.jsons'

const getData = async() => await axios.get(latestDataUrl);

(async () => {
  const { data } = await getData();
  const { items, sets } = data;

  const iconUrls = [];
  const newItems = items.map((item: Item, index: number) => {
    return parseItem(item, index, (newItem) => {
      const iconUrl = 'http://raw.communitydragon.org/latest/game/' + item.icon.replace('.dds', '.png').toLowerCase();
      newItem.icon = iconUrl.substring(iconUrl.lastIndexOf('/')+1);
      iconUrls.push(iconUrl);
      return newItem;
    })
  })

  let downloadsPromises = [];
  try {
    downloadsPromises = iconUrls.map(url => download(url));
  } catch (e) {
    console.log(e.status)
  }
  const all = await Promise.all(downloadsPromises)

  console.log(newItems[0])
})();
