import axios from 'axios';
import { parseItem } from './utils/parseItem';
import download from './utils/download';


const latestDataUrl = 'http://raw.communitydragon.org/latest/cdragon/tft/en_us.json';
const pbeDataUrl = 'https://raw.communitydragon.org/pbe/cdragon/tft/en_us.json';
const fakeUrl = 'https://raw.communitydragon.org/pbe/cdragon/tft/en_us.jsons'

const downloadPromises = [];
const getData = async() => {
  return await axios.get(latestDataUrl);
}

(async () => {
  const { data } = await getData();
  const { items, sets } = data;

  const iconUrls = [];
  const newItems = items.map((item: any, index: number) => {
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

// .then(({ data }) => {
//   const { items, sets }: any = data;
//   const newItems = items.map((item, index) => {
//     return parseItem(item, index, () => {
//       const iconUrl = 'http://raw.communitydragon.org/latest/game' + item.icon.replace('.dds', '.png');
//       delete item.desc;
//       downloadPromises.push(download(iconUrl));
//     })
//   })
// }).catch(err => console.log(err))



// console.log(newItems);
