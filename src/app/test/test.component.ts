import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as OpenSeadragon from 'openseadragon';
import { Overlay, Point, Rect, TiledImageOptions } from 'openseadragon';
import { AfikomanComponent } from '../afikoman/afikoman.component';
import { AngularFireStorage } from '@angular/fire/storage';

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

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  viewer: OpenSeadragon.Viewer;
  @ViewChild('viewer', { static: true }) viewerElement: ElementRef;
  @ViewChild('afikoman', { static: true }) afikomanElement: AfikomanComponent;

  constructor(private storage: AngularFireStorage) { }

  ngOnInit(): void {

  }

  private loadTile(url: any) {

    const tiledImageOptions: TiledImageOptions = {
      tileSource: 'https://storage.googleapis.com/find-the-afikoman.appspot.com/default-pictures/dzi@aerial-architecture-blue-sky-buildings-466685.jpg.dzi',
      fitBounds: new Rect(0, 0, 5833, 3620 ),
      preload: true,
      // loadTilesWithAjax: true,
    };

    this.viewer.open(tiledImageOptions);

    // const location = new Point(100, 100);
    const location = new Rect(1045, 2615, 40, 40 );

    // const overlay = new Overlay({
    //
    // });

    setTimeout(() => {
      this.viewer.addOverlay({
        element: this.afikomanElement.el.nativeElement,
        location,
        checkResize: false
      });
    }, 500);
  }
}
