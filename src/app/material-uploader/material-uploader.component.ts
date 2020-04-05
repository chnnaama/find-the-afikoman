import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'app-material-uploader',
  templateUrl: './material-uploader.component.html',
  styleUrls: ['./material-uploader.component.scss']
})
export class MaterialUploaderComponent implements OnInit {
  @Output() uploadFinished = new EventEmitter<string>();

  isUploading: boolean;

  constructor(private storage: AngularFireStorage,
              private auth: AuthService,
              private spinnerService: SpinnerService,
              private db: AngularFirestore) { }

  ngOnInit() {
  }

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      this.uploadFile(fileUpload.files[0]);
    };
    fileUpload.click();
  }

  private uploadFile(file: File) {
    this.spinnerService.toggle(true);
    this.isUploading = true;
    const id = this.db.createId();
    const user = this.auth.user;
    const ref = this.storage.ref(`images/${user.uid}/${id}.jpg`);
    const task = ref.put(file);

    task.then(() => this.uploadFinished.emit(id));
  }
}

