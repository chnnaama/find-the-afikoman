import * as functions from 'firebase-functions';
import * as storage from '@google-cloud/storage';
const gcs = new storage.Storage();
import { tmpdir } from 'os';
import { join, dirname } from 'path';

// import * as globby from 'globby';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const generateThumbs = functions.storage
  .object()
  .onFinalize(async object => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath?.split('/').pop();
    const bucketDir = dirname(filePath!);

    const workingDir = join(tmpdir(), 'thumbs');
    const tmpFilePath = join(workingDir, 'source.png');

    if (fileName!.includes('thumb@') || fileName!.includes('dzi@') || filePath!.includes('dzi@') || !object.contentType!.includes('image')) {
      console.log('exiting function');
      return false;
    }

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket.file(filePath!).download({
      destination: tmpFilePath
    });

    // 3. Resize the images and define an array of upload promises
    const sizes = [256];

    const uploadPromises = sizes.map(async size => {
      const thumbName = `thumb@${size}_${fileName}`;
      const thumbPath = join(workingDir, thumbName);

      // Resize source image
      await sharp(tmpFilePath)
        .resize(size, size)
        .toFile(thumbPath);

      // Upload to GCS
      return bucket.upload(thumbPath, {
        destination: join(bucketDir, thumbName)
      });
    });

    // 4. Run the upload operations
    await Promise.all(uploadPromises);

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);
  });

export const generateDZI = functions.storage
  .object()
  .onFinalize(async object => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath?.split('/').pop();
    const bucketDir = dirname(filePath!);

    const workingDir = join(tmpdir(), 'dzis');
    const tmpFilePath = join(workingDir, 'source.png');

    const tilesList: string[] = [];

    if (fileName!.includes('thumb@') || fileName!.includes('dzi@') || filePath!.includes('dzi@') || !object.contentType!.includes('image')) {
      console.log('exiting function');
      return false;
    }

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket.file(filePath!).download({
      destination: tmpFilePath
    });

    console.info('downloaded');

    const dziName = `dzi@${fileName}`;
    const dziPath = join(workingDir, dziName);

    // Resize source image
    await sharp(tmpFilePath)
      .jpeg()
      .tile({
        size: 1024
      })
      .toFile(dziPath);

    console.info('sharped');

    async function getFiles(directory: string) {
      const items = await fs.readdir(directory);
      for (const item of items) {
        const fullPath = join(directory, item);
        const stat = await fs.stat(fullPath);
        if (stat.isFile()) {
          tilesList.push(fullPath);
        } else if (stat.isDirectory()) {
          await getFiles(fullPath);
        }
      }
    }

    await getFiles(dziPath + '_files');

    console.info(tilesList[0], tilesList[10]);

    // const tiles = await globby(`${dziPath + '_files'}/**/*`);
    // console.info({ tiles });

    // Upload to GCS
    await bucket.upload(dziPath + '.dzi', {
      destination: join(bucketDir, dziName + '.dzi')
    });

    for (const tile of tilesList) {
      const tileRelativePath = tile.split("_files/").pop();
      const tileDirectory = tileRelativePath!.split('/')[0];
      const tileFileName = tileRelativePath!.split('/')[1];
      await bucket.upload(tile, {
        destination: join(bucketDir + '/' + dziName + '_files/'+ tileDirectory, tileFileName)
      });
    }

    console.info('uploaded', dziPath + '.dzi', bucketDir, dziName + '.dzi');

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);
  });
