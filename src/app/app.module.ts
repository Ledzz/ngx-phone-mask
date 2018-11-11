import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgxPhoneMaskModule } from 'ngx-phone-mask';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule, FormsModule,
		NgxPhoneMaskModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
