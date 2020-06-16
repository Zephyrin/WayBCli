import { MediaobjectService } from './../../../_services/media-object.service';
import { BooleanEnum } from './../../../_enums/boolean.enum';
import { HttpClient } from '@angular/common/http';
import { FormErrors } from './../../../_errors/form-error';
import { Component, OnInit } from '@angular/core';
import { BrandPaginationSearchService } from '@app/_services/brand/brand-pagination-search.service';
import { CategoryPaginationSearchService } from '@app/_services/category/category-pagination-search.service';
import { Category, SubCategory, Brand, Mediaobject } from '@app/_models';

@Component({
  selector: 'app-populate',
  templateUrl: './populate.component.html',
  styleUrls: ['./populate.component.scss'],
})
export class PopulateComponent implements OnInit {
  categoryError = new FormErrors();
  brandError = new FormErrors();
  constructor(
    public brandService: BrandPaginationSearchService,
    public categoryService: CategoryPaginationSearchService,
    private mediaService: MediaobjectService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.brandService.isValidator = false;
    this.brandService.noPagination = BooleanEnum.true;
    this.brandService.init(undefined, undefined, undefined);
    this.categoryService.isValidator = false;
    this.categoryService.noPagination = BooleanEnum.true;
    this.categoryService.init(undefined, undefined, undefined);
  }

  addDefaultValuesCategory() {
    const defaultCategory = [
      {
        name: 'Clothes',
        SubCategories: [
          { name: 'Trousers' },
          { name: 'T-Shirts' },
          { name: 'Sweaters' },
          { name: 'Jackets' },
          { name: 'Raincoats' },
          { name: 'Underwears' },
          { name: 'Shoes' },
          { name: 'Gloves' },
          { name: 'Others' },
        ],
      },
      {
        name: 'Sleeping',
        SubCategories: [
          { name: 'Tents' },
          { name: 'Sleeping bags' },
          { name: 'Sleeping pags' },
          { name: 'Pillows' },
          { name: 'Others' },
          { name: 'Hammocks' },
        ],
      },
      {
        name: 'Cooking',
        SubCategories: [
          { name: 'Stoves' },
          { name: 'Pot' },
          { name: 'Cutleries' },
          { name: 'Accessories' },
        ],
      },
      {
        name: 'Bags',
        SubCategories: [
          { name: 'Backpacks' },
          { name: 'Bags' },
          { name: 'Waterproof bags' },
          { name: 'Accesories' },
        ],
      },
      {
        name: 'Walking',
        SubCategories: [{ name: 'Polls' }, { name: 'Gaiters' }],
      },
      {
        name: 'Accesories',
        SubCategories: [
          { name: 'Lamps' },
          { name: 'Pharmacies' },
          { name: 'Knives' },
        ],
      },
    ];
    defaultCategory.forEach((cat) => {
      const values = this.categoryService.values.filter(
        (x) => x.name === cat.name
      );
      if (values.length === 0) {
        const nCat = new Category();
        nCat.name = cat.name;
        nCat.validate = nCat.askValidate = true;
        nCat.subCategories = [];
        this.categoryService.values.push(nCat);
        this.addSubCat(nCat, cat.SubCategories);
        this.categoryService.service.create(nCat).subscribe(
          (ret) => {},
          (error: any) => {
            this.categoryError.formatError(error);
          }
        );
      } else {
        values.forEach((pCat) => {
          this.addSubCat(pCat, cat.SubCategories);
          this.categoryService.service.update(pCat).subscribe(
            (ret) => {},
            (error) => {
              this.categoryError.formatError(error);
            }
          );
        });
      }
    });
  }

  addSubCat(cat: Category, subCat: any) {
    subCat.forEach((sub) => {
      const values = cat.subCategories.filter((x) => x.name === sub.name);
      if (values.length === 0) {
        const nSubCat = new SubCategory();
        nSubCat.name = sub.name;
        nSubCat.validate = nSubCat.askValidate = true;
        cat.subCategories.push(nSubCat);
      }
    });
  }

  addDefaultValuesBrand() {
    const defaultBrands = [
      {
        name: 'DD Hammocks',
        uri: 'https://www.ddhammocks.com/',
        logo: 'logo_dd_hammocks.jpg',
      },
      {
        name: 'Decathlon',
        uri: 'https://www.decathlon.fr/',
        logo: 'logo_decathlon.png',
      },
      {
        name: 'Fjällräven',
        uri: 'https://www.fjallraven.com/',
        logo: 'logo_fjallraven.png',
      },
      {
        name: 'Forclaz',
        uri: 'https://www.forclaz.fr/',
        logo: 'logo_forclaz.png',
      },
      {
        name: 'Lestra',
        uri: 'http://www.lestra-outdoor.fr/',
        logo: 'logo_lestra.jpg',
      },
      {
        name: 'Macpac',
        uri: 'https://www.macpac.co.nz/',
        logo: 'logo_macpac.jpg',
      },
      {
        name: 'Millet',
        uri: 'https://www.millet.fr/',
        logo: 'logo_millet.png',
      },
      {
        name: 'MSR',
        uri: 'https://www.msrgear.com/',
        logo: 'logo_msrgear.jpg',
      },
      {
        name: 'Opinel',
        uri: 'https://www.opinel.com/',
        logo: 'logo_opinel.jpg',
      },
      {
        name: 'Sea to summit',
        uri: 'https://seatosummit.com/',
        logo: 'logo_seatosummit.png',
      },
      {
        name: 'Svord',
        uri: 'http://www.svord.com/index.php',
        logo: 'logo_svord.png',
      },
      {
        name: 'The north face',
        uri: 'https://www.thenorthface.com/',
        logo: 'logo_thenorthface.jpg',
      },
      {
        name: 'Therm-a-rest',
        uri: 'https://www.thermarest.com/',
        logo: 'logo_thermarest.jpg',
      },
      {
        name: 'X-Moove',
        uri: 'http://www.x-moove.com/',
        logo: 'logo_x-moove.png',
      },
    ];
    defaultBrands.forEach((brand) => {
      const values = this.brandService.values.filter(
        (x) => x.name === brand.name
      );
      if (values.length === 0) {
        const nBrand = new Brand();
        nBrand.name = brand.name;
        nBrand.uri = brand.uri;
        nBrand.logo = new Mediaobject();
        nBrand.logo.description = 'Logo of ' + nBrand.name;
        nBrand.validate = nBrand.askValidate = true;
        this.http
          .get('/assets/default_brands/' + brand.logo, {responseType: 'blob'})
          .subscribe(
            (data: Blob) => {
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                nBrand.logo.image = reader.result;
                this.mediaService.create(nBrand.logo)
                  .subscribe(logoC => {
                    nBrand.logo.id = logoC.id;
                    nBrand.logo.filePath = logoC.filePath;
                    this.brandService.service.create(nBrand)
                    .subscribe(b => {
                      this.brandService.values.push(new Brand(b));
                    }, error => {
                      this.brandError.formatError(error);
                    });
                  }, (error: any) => {
                    this.brandError.formatError(error);
                  });
              }, false);
              reader.readAsDataURL(data);
            },
            (error) => {
              this.brandError.formatError(error);
            }
          );
      }
    });
  }
}
