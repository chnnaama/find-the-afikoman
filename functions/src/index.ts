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

admin.initializeApp();

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

    const thumbName = `${THUMBNAILS_PREFIX}$${fileName}`;
    const thumbPath = join(workingDir, thumbName);

    // ignore files already processed to prevent infinite loop
    if (isProcessed(filePath) || !object.contentType!.includes('image')) return false;

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket
      .file(filePath)
      .download({
        destination: tmpFilePath
      });

    // Resize source image
    await sharp(tmpFilePath)
      .rotate()
      .resize({ width: 400 })
      .toFile(thumbPath);

    // Upload to GCS
    await bucket.upload(thumbPath, {
      destination: join(bucketDir, thumbName)
    });



    // update db
    const db = admin.firestore();
    const thumbnailField = new FieldPath('postProcess', 'thumbnail');
    const docRef = db.doc(`challenges/${id}`);

    const metadata = await sharp(tmpFilePath)
      .metadata();

    console.info({ metadata });

    await docRef.update({
        width: [6, 8].includes(metadata.orientation as number) ? metadata.height : metadata.width,
        height: [6, 8].includes(metadata.orientation as number) ? metadata.width : metadata.height,
      });

    await docRef.update(thumbnailField, true);

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);

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
      .rotate()
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
    const tilesField = new FieldPath('postProcess', 'tiles');

    return db.doc(`challenges/${id}`)
      .update(tilesField, true);
  });

function isProcessed(filePath: string): boolean {
  let result = false;

  [ THUMBNAILS_PREFIX, DZI_PREFIX ]
    .forEach(prefix => {
      if (filePath.includes(prefix)) result = true
    });

  return result;
}
