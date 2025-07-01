import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  
export class SideNavService {
  
  public toggleNav: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public currentToggle: Observable<boolean>;

  private iconStateSubject = new BehaviorSubject<boolean>(true);
  iconState$ = this.iconStateSubject.asObservable();
  
  constructor() { 
    this.currentToggle = this.toggleNav.asObservable();
  }

  public toggle(): void {
    this.toggleNav.next(!this.toggleNav.value);
  }

  public get getToggleValue(): boolean {
    return this.toggleNav.value;
  }

  toggleIconState() {
    this.iconStateSubject.next(!this.iconStateSubject.value);
  }
}