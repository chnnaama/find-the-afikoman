import * as functions from 'firebase-functions';
import * as storage from '@google-cloud/storage';
const gcs = new storage.Storage();
import { tmpdir } from 'os';
import { join, dirname, basename } from 'path';

import * as globby from 'globby';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';
import * as admin from 'firebase-admin';
import FieldPath = admin.firestore.FieldPath;

const THUMBNAILS_PREFIX = 'thumb@';
const DZI_PREFIX = 'dzi@';

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
    const filePath = object.name as string;
    const fileName = basename(filePath);
    const bucketDir = dirname(filePath);
    const id = fileName.split('.').slice(0, -1).join('.');

    const workingDir = join(tmpdir(), 'thumbs');
    const tmpFilePath = join(workingDir, fileName);

    // ignore files already processed to prevent infinite loop
    // ignore non-image files
    if (isProcessed(filePath) || !object.contentType!.includes('image')) return false;

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket
      .file(filePath)
      .download({
        destination: tmpFilePath
      });

    // 3. Resize the images and define an array of upload promises
    const sizes = [256];

    const uploadPromises = sizes.map(async size => {
      const thumbName = `${THUMBNAILS_PREFIX}${size}_${fileName}`;
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
    await fs.remove(workingDir);

    // update db
    const db = admin.firestore();
    const thumbnailField = new FieldPath('postProcessing', 'thumbnail');

    return db.doc(`images/${id}`)
      .update(thumbnailField, true);

  });

export const generateDZI = functions.storage
  .object()
  .onFinalize(async object => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name as string;
    const fileName = basename(filePath);
    const bucketDir = dirname(filePath);
    const id = fileName.split('.').slice(0, -1).join('.');

    const workingDir = join(tmpdir(), 'dzis');
    const tmpFilePath = join(workingDir, fileName);

    const dziName = `${DZI_PREFIX}${fileName}`;
    const dziPath = join(workingDir, dziName);

    // ignore files already processed to prevent infinite loop
    // ignore non-image files
    if (isProcessed(filePath) || !object.contentType!.includes('image')) return false;

    // Ensure dzis dir exists
    await fs.ensureDir(workingDir);

    // Download Source File
    await bucket
      .file(filePath)
      .download({
        destination: tmpFilePath
      });

    console.info('downloaded');

    // Tile source image and create two items:
    // (1) dzi@{filename}.dzi xml file
    // (2) dzi@{filename}_files folder with all the tiles
    await sharp(tmpFilePath)
      .jpeg()
      .tile({
        size: 512
      })
      .toFile(dziPath);

    console.info('sharped');

    // Upload xml file to GCS
    await bucket.upload(dziPath + '.dzi', {
      destination: join(bucketDir, dziName + '.dzi')
    });

    // get a full list of tiles
    const tiles = await globby(`${dziPath + '_files'}/**/*`);

    // upload each tile to it's rightful folder
    for (const tile of tiles) {
      const tilePath = tile.split(workingDir).pop() as string;
      const tileDirectory = dirname(tilePath);
      const tileFileName = basename(tilePath);

      await bucket.upload(tile, {
        destination: join(bucketDir, tileDirectory, tileFileName)
      });
    }

    console.info('uploaded', dziPath + '.dzi', bucketDir, dziName + '.dzi');

    // Cleanup remove the tmp/dzis from the filesystem
    await fs.remove(workingDir);

    // update db
    const db = admin.firestore();
    const thumbnailField = new FieldPath('postProcessing', 'thumbnail');

    return db.doc(`images/${id}`)
      .update(thumbnailField, true);
  });

function isProcessed(filePath: string): boolean {
  let result = false;

  [ THUMBNAILS_PREFIX, DZI_PREFIX ]
    .forEach(prefix => {
      if (filePath.includes(prefix)) result = true
    });

  return result;
}
