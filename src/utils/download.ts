import * as http from 'http';
import * as fs from 'fs';
import axios from 'axios';

const getFileName = str => str.split(/(\\|\/)/g).pop();

export default async(url) => {
  const writer = fs.createWriteStream(`./assets/${getFileName(url)}`)
  console.log(url)
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
    response.data.pipe(writer)
  } catch(err) {
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

