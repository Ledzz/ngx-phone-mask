import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPhoneMaskModule } from './ngx-phone-mask/ngx-phone-mask.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxPhoneMaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
