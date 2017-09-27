# NgxPhoneMask

Angular directive for autoformatting international phone numbers.

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
<input ngxPhoneMask [(ngModel)]='yourModelName'>
or
<input ngxPhoneMask [formControl]='yourControl'>
or
<input ngxPhoneMask formControlName='yourControlName'>
```

## Config
You can set `valueType` to `'clean'`, `'raw'` or `'full'` to change output format.
Default is `'clean'`.
```html
<input ngxPhoneMask [(ngModel)]='yourModelName' valueType='full'>

```

## Contribution
This component is under development. Pull requests and issues (PR's better) are welcome.

To publish:
```
git commit
npm version patch
npm run build
npm publish dist
```