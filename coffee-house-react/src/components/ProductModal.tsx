import React, {useEffect, useRef, useState} from "react";
import {calculatePrice, renderPrice, setShoppingItemCount, writePriceWithDiscount,} from "../assets/helpers";
import {fetchProductById} from "../assets/api";
import {ProductAdditiveInfo, ProductSizeInfo, ProductType, SelectedProductType} from "../assets/types";
import "../styles/components/_product-modal.scss";

interface ProductModalProps {
    product: ProductType;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({product, onClose}) => {
    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState<SelectedProductType | null>(null);
    const [selectedSize, setSelectedSize] = useState<{ key: string, info: ProductSizeInfo }>();
    const [selectedAdditives, setSelectedAdditives] = useState<ProductAdditiveInfo[]>([]);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    function parseSize(size: string): number {
        const match = size.toLowerCase().match(/([\d.]+)\s*(ml|l)/);
        if (!match) return Infinity; // fallback if unrecognized format

        const value = parseFloat(match[1]);
        const unit = match[2];

        if (unit === "l") {
            return value * 1000; // convert liters to milliliters
        }
        return value; // already in ml
    }

    // --- Fetch product data when modal opens
    useEffect(() => {
        (async () => {
            try {
                const res = await fetchProductById(product.id);
                setProductData(res.data);
            } catch (err) {
                console.error("Error loading product:", err);
                alert("Something went wrong. Please, try again.");

            } finally {
                setLoading(false);
            }
        })();
    }, [product.id]);

    useEffect(() => {
        if (productData?.sizes) {
            setSelectedSize({
                key:"s",
                info:productData?.sizes?.s
            });
        }

    }, [productData]);

    const handleAdditiveToggle = (add: ProductAdditiveInfo) => {
        setSelectedAdditives((prev) =>
            prev.includes(add) ? prev.filter((a) => a.name !== add.name) : [...prev, add]
        );
    };

    // --- Compute total + discounted price
    const {total, discounted} = calculatePrice({
        product: {
            price: productData?.price ?? "0",
            discountPrice: productData?.discountPrice,
        },
        size: selectedSize,
        additives: selectedAdditives,
    });

    // --- Tooltip handlers ---
    const showToolSizeTip = (
        e: React.MouseEvent,
        sizeInfo: ProductSizeInfo,
    ) => {
        if (!tooltipRef.current || !productData) return;
        const discounted = Boolean(localStorage.getItem("user")) ? Number(sizeInfo?.discountPrice) : null
        const html = writePriceWithDiscount(Number(sizeInfo?.price).toFixed(2), discounted?.toFixed(2));
        tooltipRef.current.innerHTML = html;
        tooltipRef.current.style.left = `${e.pageX + 15}px`;
        tooltipRef.current.style.top = `${e.pageY + 15}px`;
        tooltipRef.current.classList.remove("hidden");
    };

    const showToolAdditivesToolTip = (
        e: React.MouseEvent,
        addPrice?: ProductAdditiveInfo
    ) => {
        if (!tooltipRef.current || !productData) return;
        const discounted = Boolean(localStorage.getItem("user")) ? Number(addPrice?.discountPrice) : null
        const html = writePriceWithDiscount(Number(addPrice?.price).toFixed(2), discounted?.toFixed(2));
        tooltipRef.current.innerHTML = html;
        tooltipRef.current.style.left = `${e.pageX + 15}px`;
        tooltipRef.current.style.top = `${e.pageY + 15}px`;
        tooltipRef.current.classList.remove("hidden");
    };

    const hideTooltip = () => tooltipRef.current?.classList.add("hidden");

    // --- Add product to cart
    const handleAddToCart = () => {
        if (!productData) return;
        const raw = localStorage.getItem("selectedItems");
        const existing = raw ? JSON.parse(raw) : [];

        const entry = {
            id: productData.id,
            size: selectedSize,
            additives: selectedAdditives,
        };
        localStorage.setItem("selectedItems", JSON.stringify([...existing, entry]));
        setShoppingItemCount();
        onClose();
    };

    // --- ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!productData) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    {loading ? <div className="loader">Loading...</div> : <p>Error loading product.</p>}
                </div>
            </div>
        );
    }

    return (
        <div
            id="product-modal"
            className="modal"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div id="modal-content" className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>
                    <img src="./icons/close.png" alt="close" height={16} width={16} />
                </button>
                {loading ? (
                    <div id="loader-placeholder" className="loader">
                        Loading...
                    </div>
                ) : (
                    <>
                        <img
                            loading="lazy"
                            className="modal-image"
                            src={`./images/${productData.name}.png`}
                            alt={productData.name}
                        />

                        <div className="modal-details">
                            <h3 className="modal-title heading-3">{productData.name}</h3>
                            <p className="modal-description text-medium">{productData.description}</p>

                            {/* Sizes */}
                            <div className="option-group">
                                <p className="text-medium">Size</p>
                                <div className="sizes">
                                    {Object.entries(productData.sizes).map(([key, size]) => (
                                        <button
                                            key={key}
                                            className={selectedSize?.info.size === size.size ? "active" : ""}
                                            onMouseEnter={(e) => showToolSizeTip(e, size)}
                                            onMouseLeave={hideTooltip}
                                            onClick={() => setSelectedSize({key: key, info: size})}
                                        >
                                            <div className="size-key text-link-button">{key.toUpperCase()}</div>
                                            <div className="text-link-button">{size.size}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Additives */}
                            <div className="option-group">
                                <p className="text-medium">Additives</p>
                                <div className="additives">
                                    {productData.additives.map((add, index) => (
                                        <button
                                            key={add.name}
                                            className={selectedAdditives.includes(add) ? "active" : ""}
                                            onMouseEnter={(e) => showToolAdditivesToolTip(e, add)}
                                            onMouseLeave={hideTooltip}
                                            onClick={() => handleAdditiveToggle(add)}
                                        >
                                            <div className="size-key text-link-button">{index + 1}</div>
                                            <div className="text-link-button">{add.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="total">
                                <strong className="heading-3">Total:</strong>
                                <span
                                    className="price heading-3"
                                    dangerouslySetInnerHTML={{
                                        __html: renderPrice(total, discounted),
                                    }}
                                />
                            </div>

                            {/* Note */}
                            <div className="note">
                                <img
                                    loading="lazy"
                                    height={16}
                                    width={16}
                                    src="./icons/info-empty.png"
                                    alt="info"
                                />
                                <div className="text-caption">
                                    The cost is not final. Download our mobile app to see the final price and place
                                    your order. Earn loyalty points and enjoy your favorite coffee with up to 20%
                                    discount.
                                </div>
                            </div>

                            <button className="close-btn text-link-button" onClick={handleAddToCart}>
                                Add to cart
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Tooltip */}
            <div ref={tooltipRef} className="price-tooltip hidden"/>
        </div>
    );
};
