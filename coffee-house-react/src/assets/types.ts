export interface ProductType {
    name: string,
    discountPrice: string,
    category: "coffee" | "tea" | "dessert",
    price: string
    description: string,
    id: number,
}

export interface ProductSizeInfo {
    size: "s" | "m" | "l";              // e.g., "200 ml"
    price: string;             // e.g., "7.00"
    discountPrice?: string;    // optional, since not all sizes have it
}

export interface ProductAdditiveInfo {
    name: string;              // e.g., "200 ml"
    price: string;             // e.g., "7.00"
    discountPrice?: string;    // optional, since not all sizes have it
}

export type ProductSizes = Record<string, ProductSizeInfo>;

export interface SelectedProductType extends ProductType {
    additives: ProductAdditiveInfo[]
    sizes: ProductSizes
}

export interface UserData {
    login: string;
    token?: string;
    city: string;
    street: string;
    houseNumber: number;
    paymentMethod: string;
}

export type CartItemType = {
    id: number;
    product: SelectedProductType;
    size?: { key: string, info: ProductSizeInfo };
    additives?: Array<ProductAdditiveInfo>
};
