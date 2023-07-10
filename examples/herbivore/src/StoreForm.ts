import {store} from './Store';

const SETTINGS_ID = 'settings';

export class StoreForm {

  private $form = document.getElementById(SETTINGS_ID);
  private $inputs = {};
  constructor() {
    Object.keys(store).forEach(k => {
      this.createFormFieldDom(k);
    });
  }

  public updateStore() {
    Object.keys(store).forEach(k => {
      store[k] = parseInt(this.$inputs[k].value, 10);
    });
    console.log('Updated store', store);
  }

  private createFormFieldDom(k: string) {
    const $input = document.createElement('input');
    $input.setAttribute('type', 'text');
    $input.setAttribute('value', store[k]);
    const $label = document.createElement('label');
    $label.innerHTML = k + ':';
    $label.append(document.createElement('br'));
    $label.append($input);
    const $div = document.createElement('div');
    $div.classList.add('store-form-field');
    $div.append($label);
    this.$form.append($div);
    this.$inputs[k] = $input;
  }
}
