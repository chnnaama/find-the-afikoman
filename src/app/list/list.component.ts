import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Challenge } from '../types/challenge';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  challenges$: Observable<Challenge[]>;

  constructor(private router: Router,
              private db: AngularFirestore) { }

  ngOnInit(): void {
    const colRef = this.db.collection<Challenge>('challenges', ref => ref
      .where('public', '==', true)
    );
    this.challenges$ = colRef.valueChanges();
  }

  openChallenge(challenge: Challenge) {
    this.router.navigate(['/challenge', challenge.id]);
  }
}
