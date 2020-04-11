import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { TestComponent } from './test/test.component';
import { MaterialModule } from './material/material.module';
import { AfikomanComponent } from './afikoman/afikoman.component';
import { CongratsComponent } from './challenge/congrats/congrats.component';
import { WelcomeComponent } from './challenge/welcome/welcome.component';
import { ListComponent } from './list/list.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { SpinnerComponent } from './spinner/spinner.component';
import { UploadComponent } from './upload/upload.component';
import { MaterialUploaderComponent } from './material-uploader/material-uploader.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { StopwatchComponent } from './challenge/stopwatch/stopwatch.component';
import { PauseComponent } from './challenge/pause/pause.component';
import { ShareButtonComponent } from './share-button/share-button.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { EditComponent } from './edit/edit.component';
import { InstructionsComponent } from './edit/instructions/instructions.component';
import { SuccessComponent } from './edit/success/success.component';
import { HintComponent } from './hint/hint.component';

// the second parameter 'he-IL' is optional
// registerLocaleData(localeHe, 'he-IL');
const firebaseConfig = {
  apiKey: 'AIzaSyB4iObVhimtSdx6toQqhox-6hs3QjUAvI8',
  authDomain: 'easter-egg-hunt-online.firebaseapp.com',
  databaseURL: 'https://easter-egg-hunt-online.firebaseio.com',
  projectId: 'easter-egg-hunt-online',
  storageBucket: 'easter-egg-hunt-online.appspot.com',
  messagingSenderId: '1050225342636',
  appId: '1:1050225342636:web:2a65cad5286dfd9affc709',
  measurementId: 'G-ETP5TFL1DN'
};

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    AfikomanComponent,
    CongratsComponent,
    WelcomeComponent,
    ListComponent,
    SpinnerComponent,
    UploadComponent,
    MaterialUploaderComponent,
    ChallengeComponent,
    StopwatchComponent,
    PauseComponent,
    ShareButtonComponent,
    EditComponent,
    InstructionsComponent,
    SuccessComponent,
    HintComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MaterialModule,
    ClipboardModule,
  ],
  providers: [
  ],
  entryComponents: [
    CongratsComponent,
    WelcomeComponent,
    PauseComponent,
    InstructionsComponent,
    SuccessComponent,
    HintComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
