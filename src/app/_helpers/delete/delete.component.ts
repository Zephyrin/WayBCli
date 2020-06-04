import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ViewChild } from '@angular/core';

import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal;
  @Input() titleName;
  @Input() contentName;
  @Input() btnName;
  @Input() loading: boolean;
  @Input() errors: FormErrors;
  @Output() done = new EventEmitter<boolean>();
  constructor() {
  }

  ngOnInit(): void {
  }

  onDelete() {
    this.done.emit(true);
  }

  onCancel() {
    this.done.emit(false);
    this.close();
  }

  close() {
    $(this.modal.nativeElement).modal('hide');
  }

  open() {
    $(this.modal.nativeElement).modal('show');
  }
}
