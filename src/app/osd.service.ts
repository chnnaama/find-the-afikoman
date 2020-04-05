import { Injectable } from '@angular/core';
import * as OpenSeadragon from 'openseadragon';
import { TiledImageOptions } from 'openseadragon';

const OSD_OPTIONS: OpenSeadragon.Options = {
  preload: true,
  showNavigator: false, // image map
  showNavigationControl: false, // zoom, etc.
  maxZoomPixelRatio: 3,
  springStiffness: 24,
  animationTime: 1,
  minZoomImageRatio: 1,
  visibilityRatio: 1, // prevent moving image outside viewport
  // crossOriginPolicy: 'Anonymous', // required for openseadragon-filtering
  gestureSettingsMouse: {
    clickToZoom: false,
    // dblClickToZoom: false,
    flickMomentum: 0
  },
  // preserveImageSizeOnResize: false
};

@Injectable({
  providedIn: 'root'
})
export class OsdService {
  viewer: OpenSeadragon.Viewer;

  constructor() { }

  initialize(element: HTMLElement) {
    this.viewer = new OpenSeadragon.Viewer({
      element,
      ...OSD_OPTIONS
    });
  }

  loadTile(tiledImage: TiledImageOptions) {
    this.viewer.open(tiledImage);
  }

}
