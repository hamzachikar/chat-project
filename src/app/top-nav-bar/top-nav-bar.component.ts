import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'topNav',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit {
  @Output()
  logOut=new EventEmitter<boolean>();
  @Output()//declaring our output property 
  openNav=new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }
  logout(){
    this.logOut.emit();
  }
  openSideNav(){
    this.openNav.emit();
  }
}
