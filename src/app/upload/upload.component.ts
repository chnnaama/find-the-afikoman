import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerService } from '../spinner.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Challenge } from '../types/challenge';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {
  sub: Subscription;

  constructor(private spinnerService: SpinnerService,
              private router: Router,
              private db: AngularFirestore) { }

  ngOnInit(): void {
  }

  onUploadFinished(id: string) {
    const docRef = this.db.doc<Challenge>(`challenges/${id}`);
    this.sub = docRef.valueChanges().subscribe(challenge => {
      if (challenge.postProcess.thumbnail && challenge.postProcess.tiles) {
        this.spinnerService.toggle(false);
        this.router.navigate(['/edit', id]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
