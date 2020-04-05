import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { SpinnerService } from '../spinner.service';
import { ImageDocument } from '../types/imageDocument';

@Component({
  selector: 'app-material-uploader',
  templateUrl: './material-uploader.component.html',
  styleUrls: ['./material-uploader.component.scss']
})
export class MaterialUploaderComponent implements OnInit {
  @Output() uploadFinished = new EventEmitter<string>();

  isUploading: boolean;
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
      await this.createDocument();
      await this.uploadFile(fileUpload.files[0]);
      this.uploadFinished.emit(this.id);
    };
    fileUpload.click();
  }

  private uploadFile(file: File) {
    this.spinnerService.toggle(true);
    this.isUploading = true;
    const ref = this.storage.ref(`images/${this.auth.user.uid}/${this.id}.jpg`);
    return ref.put(file);
  }

  private createDocument() {
    const newDoc = new ImageDocument(this.id, this.auth.user.uid);
    const newDocRef = this.db.doc<ImageDocument>(`images/${this.id}`);
    return newDocRef.set({ ...newDoc });
  }
}

