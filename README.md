# NgxPhoneMask

Angular component for autoformatting international phone numbers.

## Usage
Install via npm:
```shell
npm install ngx-phone-mask
```

Import in your `app.module.ts`:
```ts
import { NgxPhoneMaskModule } from 'ngx-phone-mask';

@NgModule({
  imports: [
    NgxPhoneMaskModule
  ]
})
```

Use it:
```html
<ngx-phone-mask [(ngModel)]='yourModelName'></ngx-phone-mask>
or
<ngx-phone-mask [formControl]='yourControl'></ngx-phone-mask>
or
<ngx-phone-mask formControlName='yourControlName'></ngx-phone-mask>
```

## Config
You can set `valueType` to `'clean'`, `'raw'` or `'full'` to change output format.
Default is `'clean'`.

## Contribution
This component is under development. Pull requests and issues (PR's better) are welcome.