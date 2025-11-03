import React from "react";
import type {ProductType} from "../../assets/types";
import {renderPrice} from "../../assets/helpers";

interface CartItemProps {
    product: ProductType;
    sizeLabel: string;
    additivesLabel: string;
    total: number;
    discounted: number;
    onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
                                                      product,
                                                      sizeLabel,
                                                      additivesLabel,
                                                      total,
                                                      discounted,
                                                      onRemove,
                                                  }) => (
    <div className="cart-item">
        <div className="item-left">
            <button className="remove-item" onClick={onRemove}>
                <img loading="lazy" width={24} height={24} src="./icons/trash.png" alt="Remove"/>
            </button>

            <img
                loading="lazy"
                className="item-img"
                src={`./images/${product.name}.png`}
                alt={product.name}
            />

            <div className="item-info">
                <h3 className="heading-3">{product.name}</h3>
                <p className="text-medium">
                    {sizeLabel}
                    {additivesLabel && `, ${additivesLabel}`}
                </p>
            </div>
        </div>

        <div
            className="item-right"
            dangerouslySetInnerHTML={{__html: renderPrice(total, discounted > 0 ? discounted : undefined)}}
        />
    </div>
);
