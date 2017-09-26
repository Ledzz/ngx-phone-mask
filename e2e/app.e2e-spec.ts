import { NgxPhoneMaskPage } from './app.po';

describe('ngx-phone-mask App', () => {
  let page: NgxPhoneMaskPage;

  beforeEach(() => {
    page = new NgxPhoneMaskPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
