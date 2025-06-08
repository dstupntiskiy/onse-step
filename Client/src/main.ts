import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as moment from 'moment';
import 'moment/locale/ru'; 

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

moment.locale('ru')
