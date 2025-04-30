import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalVisibleSubject = new BehaviorSubject<boolean>(false);
  modalVisible$ = this.modalVisibleSubject.asObservable();

  toggleModal() {
    this.modalVisibleSubject.next(!this.modalVisibleSubject.value);
  }

  closeModal() {
    this.modalVisibleSubject.next(false);
  }

  openModal() {
    this.modalVisibleSubject.next(true);
  }
}