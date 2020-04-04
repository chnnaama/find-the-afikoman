import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as OpenSeadragon from 'openseadragon';
import { TiledImageOptions } from 'openseadragon';

const OSD_OPTIONS: OpenSeadragon.Options = {
  // preload: true,
  showNavigator: false, // image map
  showNavigationControl: false, // zoom, etc.
  // maxZoomPixelRatio: 3,
  // minZoomImageRatio: 1,
  // visibilityRatio: 1, // prevent moving image outside viewport
  // crossOriginPolicy: 'Anonymous', // required for openseadragon-filtering
  // gestureSettingsMouse: {
  //   clickToZoom: false,
  //   dblClickToZoom: false,
  // },
  // preserveImageSizeOnResize: false
};

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  viewer: OpenSeadragon.Viewer;
  @ViewChild('viewer', { static: true }) viewerElement: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.viewer = new OpenSeadragon.Viewer({
      element: this.viewerElement.nativeElement,
      ...OSD_OPTIONS
    });

    const tiledImageOptions: TiledImageOptions = {
      tileSource: '/assets/test/test.dzi',
    };

    this.viewer.open(tiledImageOptions);
  }

}
