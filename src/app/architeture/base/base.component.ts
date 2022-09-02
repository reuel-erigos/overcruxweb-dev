import { AbstractControl, FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { ObjectUtil } from '../../utils/object-util';
export abstract class BaseComponent{

  form: FormGroup;

  numberItens: number;

  pageIndex: number = 0;

  pageSize: number = 10;

  constructor() {
  }

  setFormGroup(formGroup: FormGroup) {
    this.form = formGroup;
  }

  fieldIsInvalid(field: string): Boolean {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  fieldIsInvalidIgnoreTouched(field: string): Boolean {
    if (this.form.get(field)) {
      return !this.form.get(field).valid;
    }

    return false;
  }

  getControl(formulario: FormGroup, nomeCampo: string): AbstractControl {
    if (!ObjectUtil.isEmpty(formulario)) {
      const campo: AbstractControl = formulario.get(nomeCampo);
      if (!ObjectUtil.isEmpty(campo)) {
        return formulario.get(nomeCampo);
      }
    }
    return null;
  }

  getValueForm(form: FormGroup, fieldName: string): any {
    const field = this.getControl(form, fieldName);
    if (!field) {
      return null;
    }
    return field.value;
  }

  getValueFormAsType<T>(form: FormGroup, fieldName: string, target: T): T {
    const field = this.getControl(form, fieldName);
    if (!field) {
      return null;
    }

    return Object.assign(target, field.value);
  }

  setValue(form: FormGroup, fieldName: string, value: any): void {
    const field = this.getControl(form, fieldName);
    if (!ObjectUtil.isEmpty(field)) {
      field.setValue(value);
    }
  }

  isFieldRequired(fielddName: string): boolean {
    const control = this.form.get(fielddName);
    if (control) {
      if (control.validator) {
        const validator = control.validator({} as AbstractControl);
        if (validator && validator.required) {
          return true;
        }
      }
    }

    return false;
  }


  setError(form: FormGroup, fieldName: string) {
    this.getControl(this.form, fieldName).setErrors({ 'incorrect': true });
  }

  cleanError(form: FormGroup, fieldName: string) {
    this.getControl(this.form, fieldName).setErrors(null);
  }

  onlyNumber(obj) {
    const val = obj.srcElement.value.replace(/[^\d]+/g, '');
    obj.target.value = val;
  }

  retiraMascara(objeto) {
    return objeto.replace(/\D/g, '');
  }

}
