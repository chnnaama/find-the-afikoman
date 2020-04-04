import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CongratsComponent } from '../congrats/congrats.component';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-afikoman',
  templateUrl: './afikoman.component.html',
  styleUrls: ['./afikoman.component.scss']
})
export class AfikomanComponent implements OnInit {

  constructor(public el: ElementRef,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dialog.open(WelcomeComponent);
  }

  openDialog() {
    this.dialog.open(CongratsComponent);
  }
}
