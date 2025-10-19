interface ProductSize {
    size: string;
    ["add-price"]: string;
}



export interface ProductAdditive {
    name: string;
    ["add-price"]: string;
}


export interface MenuProduct {
    name: string;
    image_url: string;
    description: string;
    price: string | number;
    category: string;
    sizes: Record<string, ProductSize>;
    additives: ProductAdditive[];
}

export interface SliderProduct {
    category: "coffee" | 'tea',
    description: string,
    discountPrice: string,
    id: number,
    name: string,
    price: string
}