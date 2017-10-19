import { ChaffPage } from './app.po';

describe('chaff App', () => {
  let page: ChaffPage;

  beforeEach(() => {
    page = new ChaffPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
