import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { SpinnerService } from './spinner.service';
import { NavigationEnd, Router } from '@angular/router';

// tslint:disable-next-line:ban-types
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService,
              public router: Router,
              public spinnerService: SpinnerService) {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd){
          gtag('config', 'UA-162696534-2',
            {
              page_path: event.urlAfterRedirects
            }
          );
        }
      }
    );
  }

}
