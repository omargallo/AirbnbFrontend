import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal(false);
  title = '';
  message = '';
  isPrompt: boolean = false;
  oKText: string = 'Confirm';
  cancelText: string = 'Cancel';
  isSuccess: boolean = true;
  callback?:   (() => void)  = undefined;

  show(
    title: string,
    message: string,
    onConfirm: () => void,
    {
      okText = 'Confirm',
      isSuccess = true,
      isPrompt = false,
      cancelText = 'Cancel',
    }: {
      okText?: string;
      isSuccess?: boolean;
      isPrompt?: boolean;
      cancelText?: string;
    } = {}
  ) 
  {
    this.isPrompt = isPrompt ?? false;
    this.oKText = okText ?? 'Confirm';
    this.cancelText = cancelText ?? 'Cancel';
    this.isSuccess = isSuccess ?? true;
    this.title = title;
    this.message = message;
    this.callback = onConfirm;
    this.visible.set(true);
  }

  fail( title: string = "Failed",
    message: string = "Something went wrong.",
    onConfirm?:  () => void ,
    okText:string = "Ok"
  ){
    this.set(true,okText,false,title,message,true,onConfirm)
  }

  success(
    title: string ,
    message: string ,
    onConfirm?:  () => void ,
    okText:string = "Ok"
  ){

    this.set(true,okText,true,title,message,true,onConfirm)
  }

  confirm() {
    if(this.callback)
      this.callback();
    this.visible.set(false);
  }

  cancel() {
    this.visible.set(false);
  }


  set(isPrompt:boolean,okText:string,isSuccess:boolean,title:string,message:string,isVisible:boolean,onConfirm?:()=>void){
    this.isPrompt = isPrompt;
    this.oKText = okText ;
    this.isSuccess = isSuccess;
    this.title = title;
    this.message = message;
    this.callback = onConfirm ;
    this.visible.set(isVisible);
  }
}
