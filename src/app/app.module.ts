import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { TestComponent } from './test/test.component';
import { MaterialModule } from './material/material.module';
import { AfikomanComponent } from './afikoman/afikoman.component';
import { CongratsComponent } from './congrats/congrats.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ListComponent } from './list/list.component';
import { AngularFireStorageModule } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCYoShQPGulpu95s253OKdA474M11VaXDw',
  authDomain: 'find-the-afikoman.firebaseapp.com',
  databaseURL: 'https://find-the-afikoman.firebaseio.com',
  projectId: 'find-the-afikoman',
  storageBucket: 'find-the-afikoman.appspot.com',
  messagingSenderId: '723683717092',
  appId: '1:723683717092:web:94b44e66162cda03e921f1',
  measurementId: 'G-4YFKQLNWDV'
};

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    AfikomanComponent,
    CongratsComponent,
    WelcomeComponent,
    ListComponent
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
  ],
  providers: [],
  entryComponents: [
    CongratsComponent,
    WelcomeComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
