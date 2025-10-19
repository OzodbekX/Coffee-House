// favorites.ts
import { apiRequest } from "./request.js";
export async function fetchFavoriteProducts() {
    return await apiRequest("/products/favorites", {
        method: "GET",
        auth: true
    });
}
//# sourceMappingURL=api.js.map