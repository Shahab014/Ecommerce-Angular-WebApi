export interface signUp {
    Name: string;
    Email: string;
    Password: string;
    Role?:string;
}

export type addProduct = {
    id: number,
    avatar: string,
    ProductName: string,
    ProductPrice: number,
    Color: string,
    Category: string,
    quantity?: undefined | number,
    Description: string,
    productId? : undefined | number
}

export interface cart {
    id: number| undefined,
    avatar: string,
    ProductName: string,
    ProductPrice: number,
    Color: string,
    Category: string,
    quantity?: undefined | number,
    Description: string,
    userId:string|number,
    productId:number
}

export interface priceSummary{
    price:number,
    discount:number,
    tax:number,
    delivery:number,
    total:number
}

export type order = {
    id?:number;
    email:string;
    address:string;
    contact:string;
    totalPrice:number;
    userId:number;
}