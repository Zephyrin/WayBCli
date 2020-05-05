import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { FormErrors } from '@app/_errors';

declare var $: any;

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.less']
})
export class DeleteComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal;
  @Input() titleName;
  @Input() contentName;
  @Input() btnName;
  @Input() errors: FormErrors;
  @Output() done = new EventEmitter<boolean>();
  loading: boolean;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    } }

  ngOnInit(): void {
    this.loading = false;
  }

  onDelete() {
    this.loading = true;
    this.done.emit(true);
  }

  onCancel() {
    this.done.emit(false);
    this.close();
  }

  close() {
    this.loading = false;
    $(this.modal.nativeElement).modal('hide');
  }

  open() {
    this.loading = false;
    $(this.modal.nativeElement).modal('show');
  }
}
