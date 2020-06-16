import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BooleanEnum } from '@app/_enums/boolean.enum';
import { ValidationAndSearchService } from '@app/_services/helpers/validation-and-search.service';
import { Validation } from '@app/_models/validation';

@Component({
  selector: 'app-validation-and-search',
  templateUrl: './validation-and-search.component.html',
  styleUrls: ['./validation-and-search.component.scss']
})
export class ValidationAndSearchComponent<T> implements OnInit {
  @ViewChild('searchText', { static: false }) searchText: ElementRef;
  @Input() isCombo = false;
  @Input() service: ValidationAndSearchService<T>;
  @Input() displayValidate = true;
  @Input() displayAskValidate = true;
  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: [this.service.search]
    });
    this.searchForm.patchValue({search: this.service.search});
  }
  get booleanEnum() { return BooleanEnum; }

  search() {
    const text = this.searchText.nativeElement.value.toLocaleLowerCase();
    this.service.setSearch(text);
  }

  changeAskValidation() {
    this.service.filterAskValidate();
  }

  changeValidate() {
    this.service.filterValidate();
  }

}
