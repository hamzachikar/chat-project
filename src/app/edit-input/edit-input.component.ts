import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditInputComponent ),
  multi: true
};
@Component({
  selector: 'edit-input',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
  providers: [VALUE_ACCESSOR]
})
export class EditInputComponent implements ControlValueAccessor{

  @Input() label: string = "Enter value here"; 
  @Input() required: boolean = true; 
  public _value: string = ''; 
  public preValue: string = '';
  public editing: boolean = false; 
  public type:String;
  public onChange: any = Function.prototype; 
  public onTouched: any = Function.prototype; 

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  writeValue(value: any) {
    this._value = value;
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  onBlur($event: Event) {
    console.log(this.type);
    this.editing = false;
    
    if ( this._value ==""){
      //this._value = "No value available";
    }
  }

  beginEdit(value) {
    this.preValue = value;
    this.editing = true;
  }
  onFocusOut(){
    
  }
  setType(type:String){
    this.type=type;
  }
}
