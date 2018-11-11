# NgxPhoneMask ![pipeline status](https://gitlab.com/Ledzz/ngx-phone-mask/badges/master/pipeline.svg)

Angular directive for autoformatting phone numbers. Compatible with Angular 7.
Currently doesn't support phone numbers with lengths other than 11. (`+7 (987) 123-45-67`)

[Demo](https://ngx-phone-mask.surge.sh/)


## Usage
This libs rely on text-mask, so you need to install it.

Install via npm:
```shell
npm install ngx-phone-mask angular2-text-mask
```
or yarn:
```shell
yarn add ngx-phone-mask angular2-text-mask
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
You can set `clean` to `false` if you want formatted value in model.
```html
<input ngxPhoneMask [(ngModel)]='yourModelName' valueType='full'>

```

## Contribution
This component is under development. Pull requests and issues (PR's better) are welcome.

## Contributing
Please feel free to leave your PRs, issues, feature requests.

## Upcoming features
- [ ] Support other phone lengths
- [ ] Return country when recognized
- [ ] Tests
