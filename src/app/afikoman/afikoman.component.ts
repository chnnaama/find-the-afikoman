import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CongratsComponent } from '../congrats/congrats.component';
import { Challenge } from '../types/challenge';
import { OsdService } from '../osd.service';
import { Rect } from 'openseadragon';

@Component({
  selector: 'app-afikoman',
  templateUrl: './afikoman.component.html',
  styleUrls: ['./afikoman.component.scss']
})
export class AfikomanComponent implements OnInit, OnDestroy {
  @Input() challenge: Challenge;

  constructor(public el: ElementRef,
              public dialog: MatDialog,
              private osdService: OsdService) { }

  ngOnInit(): void {
    const location = new Rect(
      this.challenge.afikomanRect.x,
      this.challenge.afikomanRect.y,
      this.challenge.afikomanRect.width,
      this.challenge.afikomanRect.height
    );
    // const location = new Rect(
    //   3900,
    //   2910,
    //   100,
    //   100,
    // );
    this.osdService.addOverlay(
      this.el.nativeElement,
      location
    );
  }

  ngOnDestroy(): void {
    this.osdService.removeOverlay(this.el.nativeElement);
  }

  openDialog() {
    this.dialog.open(CongratsComponent, {
      disableClose: true
    });
  }
}
