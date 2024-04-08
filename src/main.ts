import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import moment from "moment";
moment.locale('it');
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
