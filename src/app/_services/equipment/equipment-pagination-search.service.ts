import { Injectable } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { ValidationAndSearchService } from '../helpers/validation-and-search.service';
import { EquipmentService } from './equipment.service';

import { Equipment, User, Category, SubCategory, Brand } from '@app/_models';
import { SortByEnum } from '@app/_enums/equipment.enum';
import { BooleanEnum } from '@app/_enums/boolean.enum';
import { HttpParams } from '@angular/common/http';
import { BrandPaginationSearchService } from '../brand/brand-pagination-search.service';
import { CategoryPaginationSearchService } from '../category/category-pagination-search.service';

@Injectable({
  providedIn: 'root',
})
export class EquipmentPaginationSearchService extends ValidationAndSearchService<
  Equipment
> {
  public currentUser: User;

  /* Search */
  public owned = BooleanEnum.undefined;
  public wishes = BooleanEnum.undefined;
  public others = BooleanEnum.undefined;
  private arraySubCategories = null;
  private arrayBrands = null;

  constructor(
    private service: EquipmentService,
    public brandService: BrandPaginationSearchService,
    public categoryService: CategoryPaginationSearchService
  ) {
    super(service);
    brandService.isValidator = false;
    categoryService.isValidator = false;
    brandService.initDone.subscribe((x) => {
      this.initBelongToBrand(undefined);
    });
    categoryService.initDone.subscribe((x) => {
      this.initBelongToSub(undefined);
    });
    brandService.init(undefined, undefined, undefined);
  }

  getSortByEnum() {
    return SortByEnum;
  }

  getDefaultSortByEnum() {
    return SortByEnum.name;
  }

  newValue(x: any, isInitSelected: boolean): Equipment {
    const equipment = new Equipment(x);
    if (
      this.currentUser.haves.some((have) => have.equipment.id === equipment.id)
    ) {
      equipment.has = true;
    }
    return equipment;
  }

  canEditOrDelete(equipment: Equipment): boolean {
    if (this.isValidator) {
      return equipment.askValidate;
    }
    return !equipment.validate;
  }

  filterOwned() {
    this.owned = this.booleanCycle(this.owned);
    this.changePage();
  }

  filterWishes() {
    this.wishes = this.booleanCycle(this.wishes);
    this.changePage();
  }

  filterOthers() {
    this.others = this.booleanCycle(this.others);
    this.changePage();
  }

  setDefaultParamsFromUrl(params: Params) {
    super.setDefaultParamsFromUrl(params);

    this.owned = this.getBooleanParam(params, 'owned');
    this.wishes = this.getBooleanParam(params, 'wishes');
    this.others = this.getBooleanParam(params, 'others');

    if (params && params.hasOwnProperty('belongToSubCategories')) {
      this.initBelongToSub(params.belongToSubCategories);
    } else {
      this.initBelongToSub('[]');
    }
    if (params && params.hasOwnProperty('belongToBrands')) {
      this.initBelongToBrand(params.belongToBrands);
    } else {
      this.initBelongToBrand('[]');
    }
  }

  public initBelongToBrand(str: string) {
    if (str) {
      this.arrayBrands = JSON.parse(str);
    }
    if (this.brandService.values !== undefined && this.arrayBrands) {
      if (this.arrayBrands.length > 0) {
        this.arrayBrands.forEach((x) => {
          this.brandService.values.forEach((brand) => {
            if (brand.id === x) {
              brand.inFilter = BooleanEnum.true;
            }
          });
        });
        this.brandService.values.forEach((brand) => {
          if (brand.inFilter === BooleanEnum.undefined) {
            brand.inFilter = BooleanEnum.false;
          }
        });
      } else {
        this.brandService.values.forEach((brand) => {
          if (brand.inFilter === BooleanEnum.undefined) {
            brand.inFilter = BooleanEnum.true;
          }
        });
      }
    }
  }

  public initBelongToSub(str: string) {
    if (str) {
      this.arraySubCategories = JSON.parse(str);
    }
    if (this.categoryService.values !== undefined && this.arraySubCategories) {
      if (this.arraySubCategories.length > 0) {
        this.arraySubCategories.forEach((x) => {
          this.categoryService.values.forEach((cat) => {
            cat.subCategories.forEach((sub) => {
              if (sub.id === x) {
                sub.inFilter = BooleanEnum.true;
              }
            });
          });
        });
        this.categoryService.values.forEach((cat) => {
          cat.subCategories.forEach((sub) => {
            if (sub.inFilter === BooleanEnum.undefined) {
              sub.inFilter = BooleanEnum.false;
            }
          });
        });
      } else {
        this.categoryService.values.forEach((cat) => {
          cat.subCategories.forEach((sub) => {
            if (sub.inFilter === BooleanEnum.undefined) {
              sub.inFilter = BooleanEnum.true;
            }
          });
        });
      }
    }
  }

  removeParamsFromUrl(query: {}) {
    super.removeParamsFromUrl(query);
    this.removeParam(query, 'owned');
    this.removeParam(query, 'wishes');
    this.removeParam(query, 'others');
    this.removeParam(query, 'belongToSubCategories');
    this.removeParam(query, 'belongToBrands');
  }

  setHttpParameters(httpParams: HttpParams): HttpParams {
    httpParams = super.setHttpParameters(httpParams);
    if (this.owned !== BooleanEnum.undefined) {
      httpParams = httpParams.append('owned', this.owned);
    }
    if (this.wishes !== BooleanEnum.undefined) {
      httpParams = httpParams.append('wishes', this.wishes);
    }
    if (this.others !== BooleanEnum.undefined) {
      httpParams = httpParams.append('others', this.others);
    }
    if (this.categoryService.values !== undefined) {
      let str = '[';
      let allInclude = true;
      let noneInclude = true;
      this.categoryService.values.forEach((cat) => {
        cat.subCategories.forEach((sub) => {
          if (sub.inFilter === BooleanEnum.true) {
            str += sub.id + ',';
            noneInclude = false;
          } else {
            allInclude = false;
          }
        });
      });
      str = str.replace(/,$/, '');
      str += ']';
      if (!allInclude && !noneInclude) {
        httpParams = httpParams.append('belongToSubCategories', str);
      }
    }
    if (this.brandService.values !== undefined) {
      let str = '[';
      let allInclude = true;
      let noneInclude = true;
      this.brandService.values.forEach((brand) => {
        if (brand.inFilter === BooleanEnum.true) {
          str += brand.id + ',';
          noneInclude = false;
        } else {
          allInclude = false;
        }
      });
      str = str.replace(/,$/, '');
      str += ']';
      if (!allInclude && !noneInclude) {
        httpParams = httpParams.append('belongToBrands', str);
      }
    }
    return httpParams;
  }

  checkAllBrands() {
    let isAllChecked = true;
    let isAllUnchecked = true;
    this.brandService.values.forEach((brand) => {
      if (brand.inFilter !== BooleanEnum.true) {
        isAllChecked = false;
      } else {
        isAllUnchecked = false;
      }
    });
    let val = BooleanEnum.undefined;
    if (isAllChecked && !isAllUnchecked) {
      val = BooleanEnum.false;
    } else if (!isAllChecked && isAllUnchecked) {
      val = BooleanEnum.true;
    } else {
      val = BooleanEnum.true;
    }
    this.brandService.values.forEach((brand) => {
      brand.inFilter = val;
    });
    if (val === BooleanEnum.true) {
      this.changePage();
    }
  }

  checkBrand(brand: Brand) {
    brand.inFilter =
      brand.inFilter === BooleanEnum.true
        ? BooleanEnum.false
        : BooleanEnum.true;
    this.changePage();
  }

  brandAreAllChecked() {
    let hasChecked = false;
    let hasUnchecked = false;
    if (this.brandService.values) {
      this.brandService.values.forEach((brand) => {
        if (brand.inFilter === BooleanEnum.true) {
          hasChecked = true;
        } else {
          hasUnchecked = true;
        }
      });
      if (hasChecked && !hasUnchecked) {
        return BooleanEnum.true;
      } else if (!hasChecked && hasUnchecked) {
        return BooleanEnum.false;
      }
    }
    return BooleanEnum.undefined;
  }

  checkAllSubCategories(category: Category) {
    let isAllChecked = true;
    let isAllUnchecked = true;
    category.subCategories.forEach((sub) => {
      if (sub.inFilter !== BooleanEnum.true) {
        isAllChecked = false;
      } else {
        isAllUnchecked = false;
      }
    });
    let val = BooleanEnum.undefined;
    if (isAllChecked && !isAllUnchecked) {
      val = BooleanEnum.false;
    } else if (!isAllChecked && isAllUnchecked) {
      val = BooleanEnum.true;
    } else {
      val = BooleanEnum.true;
    }
    category.subCategories.forEach((sub) => {
      sub.inFilter = val;
    });
    this.changePage();
  }

  checkSubCategories(subCategory: SubCategory) {
    subCategory.inFilter =
      subCategory.inFilter === BooleanEnum.true
        ? BooleanEnum.false
        : BooleanEnum.true;
    this.changePage();
  }

  subCategoryAreAllChecked(category: Category) {
    let hasChecked = false;
    let hasUnchecked = false;
    category.subCategories.forEach((sub) => {
      if (sub.inFilter === BooleanEnum.true) {
        hasChecked = true;
      } else {
        hasUnchecked = true;
      }
    });
    if (hasChecked && !hasUnchecked) {
      return BooleanEnum.true;
    } else if (!hasChecked && hasUnchecked) {
      return BooleanEnum.false;
    }
    return BooleanEnum.undefined;
  }
}
