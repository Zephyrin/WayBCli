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
    this.http
      .get('/assets/default_config/categories.json')
      .subscribe((defaultCategory: any) => {
        defaultCategory.forEach((cat) => {
          const values = this.categoryService.values.filter(
            (x) => x.name === cat[`name`]
          );
          if (values.length === 0) {
            const nCat = new Category();
            nCat.name = cat[`name`];
            nCat.validate = nCat.askValidate = true;
            nCat.subCategories = [];
            this.categoryService.values.push(nCat);
            this.addSubCat(nCat, cat[`SubCategories`]);
            this.categoryService.service.create(nCat).subscribe(
              (ret) => {},
              (error: any) => {
                this.categoryError.formatError(error);
              }
            );
          } else {
            values.forEach((pCat) => {
              this.addSubCat(pCat, cat[`SubCategories`]);
              this.categoryService.service.update(pCat).subscribe(
                (ret) => {},
                (error) => {
                  this.categoryError.formatError(error);
                }
              );
            });
          }
        });
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
    this.http
      .get('/assets/default_config/brands.json')
      .subscribe((defaultBrands: any) => {
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
              .get('/assets/default_brands/' + brand.logo, {
                responseType: 'blob',
              })
              .subscribe(
                (data: Blob) => {
                  const reader = new FileReader();
                  reader.addEventListener(
                    'load',
                    () => {
                      nBrand.logo.image = reader.result;
                      this.mediaService.create(nBrand.logo).subscribe(
                        (logoC) => {
                          nBrand.logo.id = logoC.id;
                          nBrand.logo.filePath = logoC.filePath;
                          this.brandService.service.create(nBrand).subscribe(
                            (b) => {
                              this.brandService.values.push(new Brand(b));
                            },
                            (error) => {
                              this.brandError.formatError(error);
                            }
                          );
                        },
                        (error: any) => {
                          this.brandError.formatError(error);
                        }
                      );
                    },
                    false
                  );
                  reader.readAsDataURL(data);
                },
                (error) => {
                  this.brandError.formatError(error);
                }
              );
          }
        });
      });
  }
}
