import * as fs from 'fs';

const saveToJson = async ({ filePath = 'test.json', object }) => {
  await fs.writeFileSync(filePath, JSON.stringify(object, null, 2));
}

export default saveToJson;
