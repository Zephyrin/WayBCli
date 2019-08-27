import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { EquipmentService } from '@app/_services/equipment.service';
import { Equipment } from '@app/_models/equipment';
import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less']
})
export class EquipmentComponent implements OnInit {

  equipmentForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  deleteError = '';
  deleteHasError = false;
  equipments: Equipment[];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private equipmentService: EquipmentService,
    private authenticationService: AuthenticationService) {
      if (!this.authenticationService.currentUserValue) {
        this.router.navigate(['/'])
      }
     }

  ngOnInit() {
    this.loading = true;
    this.deleteHasError = false;
    this.equipmentService.getAll()
      .pipe(first())
      .subscribe(equipments => {
        this.loading = false;
        this.equipments = equipments;
    });
    this.equipmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: [''],
      message: ['']
    });
  }

  get f() { return this.equipmentForm.controls; }

  onSubmit() {
    this.deleteHasError = false;
    this.submitted = true;
    if (this.equipmentForm.invalid) {
      return;
    }
    this.loading = true;
    this.equipmentService.add(this.equipmentForm.value).subscribe(equipment =>{
      this.loading = false;
      this.submitted = false;
      this.equipments.push(equipment);

    }, error => {
      this.error = error;
      this.loading = false;
    });
  }

  deleteEquipment(equipment: Equipment) {
    var index = this.equipments.indexOf(equipment);
    this.equipments.splice(index, 1);
    this.loading = false;
  }
  onDelete(equipment: Equipment) {
    this.loading = true;
    this.deleteError = '';
    this.deleteHasError = false;
    this.equipmentService.delete(equipment).subscribe(next => {
      this.deleteEquipment(equipment);
    },error => {
      if(error.status == 404) {
        this.deleteEquipment(equipment);
      }
      else {
        this.deleteHasError = true;
        this.deleteError = error.message;
        this.loading = false;
      }
    });
  }
}
