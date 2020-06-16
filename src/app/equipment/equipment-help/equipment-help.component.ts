import { Component, OnInit } from '@angular/core';
import { EquipmentPaginationSearchService } from '@app/_services/equipment/equipment-pagination-search.service';

@Component({
  selector: 'app-equipment-help',
  templateUrl: './equipment-help.component.html',
  styleUrls: ['./equipment-help.component.scss']
})
export class EquipmentHelpComponent implements OnInit {

  constructor(private service: EquipmentPaginationSearchService) { }

  ngOnInit(): void {
  }

  displayHelp() {
    return this.service?.values?.length > 0 || true;
  }

  showFilterSimblink(classHelp: string)  {
    const filterHelps = document.getElementsByClassName(classHelp);
    Array.from(filterHelps).forEach(fi => {
      fi.classList.add('helpers');
    });
    setTimeout(x => {
      Array.from(filterHelps).forEach(fi => {
        fi.classList.remove('helpers');
      });
    }, 5000);
  }
}
