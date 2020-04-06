import { Injectable } from '@angular/core';
import { Challenge } from './types/challenge';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  challenge: Challenge;

  constructor() { }
}
