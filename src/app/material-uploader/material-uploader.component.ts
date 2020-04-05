import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { SpinnerService } from '../spinner.service';
import { Challenge } from '../types/challenge';

@Component({
  selector: 'app-material-uploader',
  templateUrl: './material-uploader.component.html',
  styleUrls: ['./material-uploader.component.scss']
})
export class MaterialUploaderComponent implements OnInit {
  @Output() uploadFinished = new EventEmitter<string>();

  id: string;

  constructor(private storage: AngularFireStorage,
              private auth: AuthService,
              private spinnerService: SpinnerService,
              private db: AngularFirestore) { }

  ngOnInit() {
    this.id = this.db.createId();
  }

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = async () => {
      this.spinnerService.toggle(true);
      this.spinnerService.setText('יוצר אתגר חדש...');
      await this.createDocument();
      this.spinnerService.setText('מעלה את התמונה...');
      await this.uploadFile(fileUpload.files[0]);
      this.spinnerService.setText('כמעט סיימנו...');
      this.uploadFinished.emit(this.id);
    };
    fileUpload.click();
  }

  private uploadFile(file: File) {
    const ref = this.storage.ref(`images/${this.auth.user.uid}/${this.id}.jpg`);
    return ref.put(file);
  }

  private createDocument() {
    const newDoc = new Challenge(this.id, this.auth.user.uid);
    const newDocRef = this.db.doc<Challenge>(`challenges/${this.id}`);
    return newDocRef.set({ ...newDoc });
  }
}

