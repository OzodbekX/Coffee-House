import React, { useEffect, useState } from "react";
import { ProductType } from "@assets/types";
import { fetchProducts } from "@assets/api";
import { ProductModal } from "@components/ProductModal";
import { renderPrice } from "@assets/helpers";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";
import "@styles/pages/menu.scss";

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [activeCategory, setActiveCategory] = useState<
    "coffee" | "tea" | "dessert"
  >("coffee");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res.data);
      } catch (err) {
        setError(true);
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === activeCategory.toLowerCase(),
  );

  return (
    <div className={"menu"}>
      <h2
        className="heading-2"
        dangerouslySetInnerHTML={{ __html: t("menu.heading") }}
      ></h2>
      <section id="menu" className="menu-section">
        <div className="menu-header">
          <div className="menu-tabs">
            {["coffee", "tea", "dessert"].map((cat) => (
              <button
                key={cat}
                className={`tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat as any)}
              >
                <div className="menu-wrapper">
                  <img loading="lazy" src={`./icons/${cat}.png`} alt={cat} />
                </div>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="error">{t("alertError")}</p>
        ) : (
          <div id="menu-products" className="menu-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  loading="lazy"
                  src={`./images/${product.name}.png`}
                  alt={product.name}
                />
                <div className="card-body">
                  <h3 className="heading-3">{product.name}</h3>
                  <p className="text-medium">{product.description}</p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderPrice(
                        product.price,
                        Number(product.discountPrice) > 0
                          ? product.discountPrice
                          : undefined,
                      ),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </section>
    </div>
  );
};

export default Menu;
