import { Component, OnInit, ViewChild, SimpleChange, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackpacksPaginationSearchService } from '@app/_services/backpack/backpacks-pagination-search.service';
import { Backpack } from '@app/_models';
import { FormErrors } from '@app/_errors';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-backpack-modal',
  templateUrl: './backpack-modal.component.html',
  styleUrls: ['./backpack-modal.component.scss']
})
export class BackpackModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal', { static: true }) modal;
  @ViewChild('deleteModal', { static: true }) deleteModal;

  form: FormGroup;

  simpleChange: SimpleChange;

  submitted = false;

  private createUpdateDeleteSubscribe$: Subscription;

  get f() { return this.form.controls; }

  get invalid() { return this.submitted && this.f.message; }

  get isCreateForm() { return this.simpleChange && this.simpleChange.previousValue === null; }
  constructor(
    private formBuilder: FormBuilder,
    public service: BackpacksPaginationSearchService
  ) { }

  ngOnInit(): void {
    this.createUpdateDeleteSubscribe$ = this.service.createUpdateDeleteDone.subscribe(x => {
      this.deleteModal.close();
      $(this.modal.nativeElement).modal('hide');
    });
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
    });
    $(this.modal.nativeElement).on('hidden.bs.modal', x => {
      this.onCancel();
    });
  }

  ngOnDestroy(): void {
    this.createUpdateDeleteSubscribe$.unsubscribe();
  }

  open(backpack: Backpack = null, isDelete: boolean = false) {
    this.submitted = false;
    this.service.endTransactionError(undefined);
    if (backpack == null) {
      this.create();
    } else if (!isDelete) {
      this.update(backpack);
    } else {
      this.delete(backpack);
    }
  }

  private create() {
    this.form.reset(new Backpack());
    this.service.selected = new Backpack();
    this.simpleChange = new SimpleChange(null, this.service.selected, true);
    this.form.patchValue(this.service.selected);
    $(this.modal.nativeElement).modal();
  }

  private update(backpack: Backpack) {
    this.service.selected = backpack;
    this.simpleChange = new SimpleChange(backpack, backpack, true);
    this.form.reset(new Backpack());
    this.form.patchValue(this.service.selected);
    $(this.modal.nativeElement).modal();
  }

  private delete(deleteValue: Backpack) {
    this.service.endTransactionError(undefined);
    this.service.selected = deleteValue;
    this.simpleChange = new SimpleChange(deleteValue, null, true);
    this.deleteModal.open();
  }

  onCancel() {
    this.service.errors = new FormErrors();
    if (this.service.selected.id === undefined || this.service.selected.id === 0) {
      this.service.selected = null;
    }
  }

  onDeleteDone($event: boolean) {
    if ($event) {
      this.service.delete(this.simpleChange);
    }
  }

  onSubmit() {
    this.service.endTransactionError(undefined);
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.service.loading = true;
    if (this.simpleChange.previousValue === null) {
      this.service.httpService.create(this.form.value)
        .subscribe(backpack => {
          this.simpleChange.currentValue = new Backpack(backpack);
          this.service.endTransaction(this.simpleChange);
        }, (error: any) => {
          this.service.endTransactionError(error);
        });
    } else {
      this.service.httpService.update(this.form.value)
        .subscribe(returnValue => {
          this.simpleChange.currentValue = new Backpack(this.form.value);
          this.service.endTransaction(this.simpleChange);
        }, (error: any) => {
          this.service.endTransactionError(error);
        });
    }
  }

  isSubmittedAndHasError(name: string) {
    return this.submitted && this.form
      && (this.form.controls[name].errors || this.service.errors.hasErrors[name]);
  }
}
