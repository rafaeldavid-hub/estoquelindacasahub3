import { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { Product } from "@/types/inventory";
import { ProductCard } from "./ProductCard";
import { Search, X, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductListProps {
  products?: Product[];
  // If controls (search/input and view toggle) should be hidden because they are rendered externally
  hideControls?: boolean;
  // optional controlled search state
  search?: string;
  onSearchChange?: (value: string) => void;
  // optional controlled view mode state
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
}

export function ProductList({
  products: productsProp,
  hideControls,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: ProductListProps = {}) {
  const { products: allProducts } = useInventory();
  const { products } = { products: productsProp ?? allProducts } as { products: Product[] };
  // controlled or internal search state
  const [internalSearch, setInternalSearch] = useState("");
  const searchValue = search !== undefined ? search : internalSearch;
  const setSearchValue = onSearchChange !== undefined ? onSearchChange : setInternalSearch;

  // controlled or internal view state
  const [internalViewMode, setInternalViewMode] = useState<"list" | "grid">("list");
  const viewModeValue = viewMode !== undefined ? viewMode : internalViewMode;
  const setViewModeValue = onViewModeChange !== undefined ? onViewModeChange : setInternalViewMode;

  const filtered = products.filter((p) => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Filtros */}
      {!hideControls && (
        <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="relative flex-1 min-w-0 sm:flex-none sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou código"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
            {searchValue && (
              <button onClick={() => setSearchValue("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex gap-1 rounded-lg border bg-card/70 backdrop-blur-md p-1 border-white/20 dark:border-white/10">
            <Button
              variant={viewModeValue === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewModeValue("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewModeValue === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewModeValue("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs sm:text-sm text-muted-foreground">{filtered.length} produto(s) encontrado(s)</p>

      {/* Lista ou Grid */}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-2 sm:space-y-3"
        }
      >
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-8 sm:py-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">Nenhum produto encontrado.</p>
        </div>
      )}
    </div>
  );
}
