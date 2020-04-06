import { Injectable } from '@angular/core';
import { Challenge } from './types/challenge';
import { Rect, TiledImageOptions } from 'openseadragon';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  challenge: Challenge;

  constructor() { }

  generateTile(challenge: Challenge) {
    const tileSource = `https://storage.googleapis.com/find-the-afikoman.appspot.com/images/${challenge.uid}/dzi@${challenge.id}.jpg.dzi`;
    const tiledImageOptions: TiledImageOptions = {
      tileSource,
      fitBounds: new Rect(0, 0, challenge.width, challenge.height ),
      preload: true,
    };

    return tiledImageOptions;
  }
}
