import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Challenge } from '../types/challenge';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  challenges$: Observable<Challenge[]>;
  privateChallenges$: Observable<Challenge[]>;

  constructor(private router: Router,
              private auth: AuthService,
              private db: AngularFirestore) { }

  ngOnInit(): void {
    const colRef1 = this.db.collection<Challenge>('challenges', ref => ref
      .where('public', '==', true)
      .orderBy('level')
    );
    const colRef2 = this.db.collection<Challenge>('challenges', ref => ref
      .where('uid', '==', this.auth.user.uid)
      .where('public', '==', false)
    );
    this.challenges$ = colRef1.valueChanges();
    this.privateChallenges$ = colRef2.valueChanges();
  }

  openChallenge(challenge: Challenge) {
    this.router.navigate(['/challenge', challenge.id]);
  }

  createChallenge() {
    this.router.navigate(['/upload']);
  }
}
