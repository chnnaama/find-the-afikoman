import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  user: User;

  constructor(private auth: AngularFireAuth,
              private db: AngularFirestore,
              private router: Router) {
    auth.signInAnonymously();
    auth.user.subscribe(user => this.user = user);
    this.user$ = auth.user;
  }
}
