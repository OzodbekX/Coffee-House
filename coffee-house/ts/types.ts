interface ProductSize {
    size: string;
    ["add-price"]: string;
}



export interface ProductAdditive {
    name: string;
    ["add-price"]: string;
}


export interface SliderProduct {
    name: string,
    discountPrice: string,
    category: "coffee" | "tea" | "dessert",
    price: string
    description: string,
    id: number,
}
export interface MenuProduct extends SliderProduct {
    discountPrice: string
}
