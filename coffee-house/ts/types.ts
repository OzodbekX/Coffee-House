
export interface ProductType {
    name: string,
    discountPrice: string,
    category: "coffee" | "tea" | "dessert",
    price: string
    description: string,
    id: number,
}


export interface UserData {
    login: string;
    token: string;
    city: string;
    street: string;
    houseNumber: number;
    paymentMethod: string;
}