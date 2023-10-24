import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { addProduct } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  filteredString: string = '';
  filterQuery: string = ''
  searchResults!: addProduct[];

  constructor(private activeRoute: ActivatedRoute, private service: ProductService, private router: Router) { }

  ngOnInit() {
    //let query = this.activeRoute.snapshot.paramMap.get('query');

    this.activeRoute.paramMap.subscribe((p: ParamMap) => {
      this.filterQuery = p.get('query') as string;
    })

    this.redirectPath();
    this.loadProducts();
  }

  loadProducts() {
    this.router.navigate([`/search/${this.filterQuery}`])

    this.service.productList().subscribe((data) => {
      this.searchResults = data;
    })
    this.filteredString = this.service.serviceFilteredString;
    
  }

  redirectPath(){
    let newLocation = `/pathName/${this.filterQuery}`;
    this.router.routeReuseStrategy
      .shouldReuseRoute = function () {
        return false;
      };
    
    this.router.navigateByUrl(newLocation).then((worked)=>{

    }, (error)=>{
      console.log(error);      
    })
  }
}
