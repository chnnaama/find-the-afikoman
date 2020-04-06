import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { Challenge } from '../types/challenge';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent implements OnInit {
  @Input() text: string;
  @Input() url: string;

  constructor(private snackBar: MatSnackBar,
              private clipboard: Clipboard) { }

  ngOnInit(): void {
  }

  onClick() {
    // @ts-ignore
    if (navigator.share) {
      // @ts-ignore
      navigator.share({
        title: 'אתגר האפיקומן',
        text: this.text,
        url: this.url,
      }).then(() => {
        console.log('Thanks for sharing!');
      })
        .catch(console.error);
    } else {
      this.clipboard.copy(`${this.text} ${this.url}`);
      const message = 'הקישור הועתק!';
      this.snackBar.open(message, '', {
        duration: 3000,
      });
    }
  }
}
