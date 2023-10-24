import { Pipe, PipeTransform } from '@angular/core';
import { addProduct } from '../models/sellerFields';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(list: addProduct[], filterText: string): any {
    return list ? list.filter(item => item.ProductName
      .search(new RegExp(filterText,'i')) > -1 ||
     item.Category.search(new RegExp(filterText,'i')) > -1 ) : [];
  }

}
