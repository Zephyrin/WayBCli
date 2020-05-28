import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '@app/_services/brand/brand.service';
import { MediaobjectService } from '@app/_services/media-object.service';

import { Brand, Mediaobject } from '@app/_models/';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { FormErrors } from '@app/_errors';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { BrandPaginationSearchService } from '@app/_services/brand/brand-pagination-search.service';

declare var $: any;

@Component({
  selector: 'app-brand-update',
  templateUrl: './brand-update.component.html',
  styleUrls: ['./brand-update.component.scss']
})
export class BrandUpdateComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal;
  @ViewChild('deleteModal', { static: true }) deleteModal;
  @Output() added = new EventEmitter<Brand>();
  @Input() brandService: BrandPaginationSearchService;

  form: FormGroup;
  isCreateForm: boolean;
  errors = new FormErrors();
  loading = false;
  submitted = false;
  selected = undefined;

  deleteError: string = undefined;
  deleteHasError = false;

  imageSrc: SafeResourceUrl;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: BrandService,
    private mediaService: MediaobjectService,
    private authenticationService: AuthenticationService,
    private domSanitizer: DomSanitizer) {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  get f() { return this.form.controls; }

  get invalid() { return this.submitted && this.f.message; }

  ngOnInit() {
    this.loading = true;
    this.isCreateForm = true;
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      uri: ['', Validators.pattern(urlRegex)],
      logo: this.formBuilder.group({
        id: [''],
        filePathUser: [''],
        filePath: [''],
        image: [''],
        description: ['']
      })
    });

    this.loading = false;
  }

  open(brand: Brand = null) {
    this.loading = false;
    this.submitted = false;
    if (brand === null) {
      this.create();
    } else {
      this.update(brand);
    }
    $(this.modal.nativeElement).modal();
  }

  isSubmittedAndHasError(name: string) {
    return this.submitted && this.form && this.form.controls[name]
      && (this.form.controls[name].errors || this.errors.hasErrors[name]);
  }

  setSelected(selected: Brand) {
    if (!this.loading) {
      if (selected === this.selected) {
        this.selected = undefined;
      } else {
        this.selected = selected;
      }
    }
  }

  update(brand: Brand) {
    this.selected = brand;
    this.imageSrc = '';
    this.form.reset(new Brand());
    this.form.patchValue(this.selected);
    this.isCreateForm = false;
    if (brand.logo && brand.logo.filePath) {
      this.imageSrc = `${environment.mediaUrl}/${brand.logo.filePath}`;
    }
  }

  create() {
    this.form.reset(new Brand());
    this.selected = new Brand();
    this.imageSrc = '';
    this.form.patchValue(this.selected);
    this.isCreateForm = true;
  }

  clearError(key) {
    this.errors.clearError(key);
  }

  onCancel() {
    this.errors = new FormErrors();
    if (this.selected.id === undefined || this.selected.id === 0) {
      this.selected = null;
    }
  }

  onSubmit() {
    this.endTransactionError(undefined);
    this.submitted = true;
    this.errors = new FormErrors();
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.manageImg();

  }

  manageImg() {
    const logo = this.form.value.logo;
    if (!this.form.controls.logo.touched) {
      this.manageBrand();
    } else if (logo.id === null) {
      if (logo.image !== null) {
        this.mediaService.create(logo)
          .subscribe(logoC => {
            this.form.patchValue({ logo: { id: logoC.id } });
            this.form.patchValue({ logo: { filePath: logoC.filePath } });
            this.manageBrand();
          }, (error: any) => {
            this.endTransactionError(error);
          });
      } else {
        this.manageBrand();
      }
    } else {
      if (logo.filePath === null) {
        this.form.value.logo = null;
        // Logo will be delete during the update.
        this.manageBrand();
      } else {
        this.mediaService.update(logo)
          .subscribe(logoC => {
            const re = /(?:\.([^.]+))?$/;

            const ext = re.exec(logo.filePath)[1];
            const reSrc = /data:image\/([a-zA-Z0-9]+)\+?.*,.*/;
            const extSrc = reSrc.exec(logo.image)[1];
            if (ext !== extSrc) {
              this.mediaService.get(logo)
                .subscribe(newLogo => {
                  this.form.patchValue({ logo: { filePath: newLogo.filePath } });
                  this.manageBrand();
                });
            } else { this.manageBrand(); }
          }, (error: any) => {
            this.endTransactionError(error);
          });
      }
    }
  }

  manageBrand() {
    if (this.isCreateForm) {
      this.service.create(this.form.value)
        .subscribe(brand => {
          this.endTransaction();
          this.brandService.addElement(brand);
          this.added.emit(brand);
        }, (error: any) => {
          this.endTransactionError(error);
        });
    } else {
      this.service.update(this.form.value)
        .subscribe(returnValue => {
          this.endTransaction();
          this.selected.update(this.form.value);
        }, (error: any) => {
          this.endTransactionError(error);
        });
    }
  }
  deleteLogo() {
    this.imageSrc = '';
    this.form.patchValue({ logo: { image: null } });
    this.form.patchValue({ logo: { filePath: null } });
    this.form.controls.logo.markAsTouched();
  }
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.imageSrc = '';
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(reader.result as string); // reader.result as string;
        this.form.patchValue({
          logo: { image: reader.result }
        });
        this.selected.logo.image = this.imageSrc;
      };
    }
  }

  onDelete(deleteValue: Brand) {
    this.selected = deleteValue;
    this.deleteModal.open();
  }

  delete($event: boolean) {
    if ($event) {
      this.loading = true;
      this.endTransactionError(undefined);
      this.service.delete(this.selected).subscribe(next => {
        this._delete(this.selected);
        this.endTransaction();
      }, error => {
        if (error.status === 404) {
          this._delete(this.selected);
          this.endTransaction();
        } else {
          this.endTransactionError(error);
        }
      });
    }
  }

  _delete(deleteValue: Brand) {
    this.endTransactionError(undefined);
    this.brandService.deleteElement(deleteValue);
    this.loading = false;
    this.selected = null;
  }

  endTransaction() {
    this.loading = false;
    this.deleteModal.close();
    $(this.modal.nativeElement).modal('hide');
  }

  endTransactionError(error) {
    this.loading = false;
    if (error) {
      this.errors.formatError(error);
    } else {
      this.errors = new FormErrors();
    }
  }
}
