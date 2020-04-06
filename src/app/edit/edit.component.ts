import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Challenge } from '../types/challenge';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../challenge.service';
import { SpinnerService } from '../spinner.service';
import { OsdService } from '../osd.service';
import { MatDialog } from '@angular/material/dialog';
import { StopwatchService } from '../stopwatch.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { InstructionsComponent } from './instructions/instructions.component';
import { map, switchMap, tap } from 'rxjs/operators';
import { Rect } from 'openseadragon';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  challenge$: Observable<Challenge>;
  @ViewChild('viewer', { static: true }) viewerElement: ElementRef;

  constructor(private route: ActivatedRoute,
              private challengeService: ChallengeService,
              private spinner: SpinnerService,
              private osdService: OsdService,
              private dialog: MatDialog,
              private stopWatch: StopwatchService,
              private db: AngularFirestore) {
    this.spinner.toggle(true);
  }

  ngOnInit(): void {
    this.dialog.open(InstructionsComponent);

    this.challenge$ = this.route.params.pipe(
      map(params => params.challengeId),
      switchMap(challengeId => {
        const docRef = this.db.doc<Challenge>(`challenges/${challengeId}`);
        return docRef.valueChanges();
      }),
      tap(challenge => this.challengeService.challenge = challenge),
      tap(challenge => this.loadChallenge(challenge)),
      tap(() => this.spinner.toggle(false)),
    );
  }

  ngOnDestroy(): void {
    this.osdService.destroy();
  }

  private loadChallenge(challenge: Challenge) {
    this.osdService.initialize(this.viewerElement.nativeElement);
    const tile = this.challengeService.generateTile(challenge);
    this.osdService.loadTile(tile);
  }

  private async saveChallenge(challenge: Challenge) {
    const docRef = this.db.doc(`challenges/${challenge.id}`);
    await docRef.update(challenge);
  }

}
