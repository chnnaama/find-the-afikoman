import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerService } from '../spinner.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ImageDocument } from '../types/imageDocument';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {
  sub: Subscription;

  constructor(private spinnerService: SpinnerService,
              private db: AngularFirestore) { }

  ngOnInit(): void {
  }

  onUploadFinished(id: string) {
    const docRef = this.db.doc<ImageDocument>(`images/${id}`);
    docRef.valueChanges().subscribe(image => {
      console.info(image);
      if (image.postProcess.thumbnail && image.postProcess.tiles) {
        this.spinnerService.toggle(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
