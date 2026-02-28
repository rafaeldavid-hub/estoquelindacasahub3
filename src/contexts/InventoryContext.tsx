import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Product, ProductStatus, StoreUnit, HistoryEntry, SofaDetails, SystemUser, OrderDetails } from "@/types/inventory";
import { generateMockProducts } from "@/data/mockData";

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "history" | "createdAt" | "updatedAt">) => void;
  updateProduct: (id: string, product: Partial<Product>, user: SystemUser, reason?: string) => void;
  updateProductStatus: (id: string, status: ProductStatus, user: SystemUser, reason?: string, soldBy?: string, soldUnit?: StoreUnit, orderDetails?: OrderDetails, soldPrice?: number, assistanceData?: { motivo: string; dataContato: string; cliente: string }) => void;
  transferProduct: (id: string, newUnit: StoreUnit, user: SystemUser, reason?: string) => void;
  setDeliveryInfo: (id: string, address: string, user: SystemUser, referencePoint?: string, type?: "Casa" | "Apartamento", apartmentNumber?: string, floor?: string, access?: "Escada" | "Elevador") => void;
  markDelivered: (id: string, user: SystemUser) => void;
  scheduleDelivery: (id: string, scheduledDate: string, user: SystemUser) => void;
  deleteProduct: (id: string, user: SystemUser) => boolean;
  getProductsByUnit: (unit: StoreUnit) => Product[];
  getProductsByStatus: (status: ProductStatus) => Product[];
  stats: {
    total: number;
    available: number;
    sold: number;
    ordered: number;
    reserved: number;
    pendingDeliveries: number;
    assistanceCount: number;
    byUnit: Record<StoreUnit, number>;
  };
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => generateMockProducts());

  const addProduct = useCallback((product: Omit<Product, "id" | "history" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      history: [{
        id: `h-${Date.now()}`,
        action: "CREATED",
        user: product.createdBy,
        timestamp: now,
        details: {
          reason: `Produto cadastrado na unidade ${product.unit}`,
        },
      }],
    };
    setProducts(prev => [newProduct, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>, user: SystemUser, reason?: string) => {
    const now = new Date().toISOString();
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const entry: HistoryEntry = {
        id: `h-${Date.now()}`,
        action: "UPDATED",
        user,
        timestamp: now,
        details: {
          reason: reason || "Produto editado",
        },
      };
      return {
        ...p,
        ...updates,
        updatedAt: now,
        history: [entry, ...p.history],
      };
    }));
  }, []);

  const updateProductStatus = useCallback((id: string, status: ProductStatus, user: SystemUser, reason?: string, soldBy?: string, soldUnit?: StoreUnit, orderDetails?: OrderDetails, soldPrice?: number, assistanceData?: { motivo: string; dataContato: string; cliente: string }) => {
    const now = new Date().toISOString();
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const entry: HistoryEntry = {
        id: `h-${Date.now()}`,
        action: status === "Assistência" ? "ASSISTANCE_OPENED" : "STATUS_CHANGED",
        user,
        timestamp: now,
        details: {
          oldStatus: p.status,
          newStatus: status,
          reason: reason || `Status alterado para ${status}`,
          ...(status === "Assistência" && assistanceData ? {
            assistenciaMotivo: assistanceData.motivo,
            assistenciaDataContato: assistanceData.dataContato,
            assistenciaCliente: assistanceData.cliente,
          } : {}),
        },
      };
      return {
        ...p,
        status,
        updatedAt: now,
        history: [entry, ...p.history],
        ...(status === "Vendido" && (soldBy || user) ? { soldBy: (soldBy || user) as any, soldAt: now, soldUnit: soldUnit || p.unit, ...(soldPrice ? { soldPrice } : {}) } : {}),
        ...(status === "Pedido" && orderDetails ? { orderDetails } : {}),
        ...(status === "Assistência" && assistanceData ? {
          assistenciaMotivo: assistanceData.motivo,
          assistenciaDataContato: assistanceData.dataContato,
          assistenciaCliente: assistanceData.cliente,
          assistenciaAbertoEm: now,
        } : {}),
      };
    }));
  }, []);

  const setDeliveryInfo = useCallback((id: string, address: string, user: SystemUser, referencePoint?: string, type?: "Casa" | "Apartamento", apartmentNumber?: string, floor?: string, access?: "Escada" | "Elevador") => {
    const now = new Date().toISOString();
    setProducts(prev => {
      const newProducts: Product[] = prev.map(p => {
        if (p.id !== id) return p;
        const entry: HistoryEntry = {
          id: `h-${Date.now()}`,
          action: "DELIVERY_INFO_SET",
          user: user,
          timestamp: now,
          details: { reason: `Venda finalizada - Endereço de entrega registrado: ${address}` },
        };
        const typedAccess = access as ("Escada" | "Elevador") | undefined;
        const typedType = type as ("Casa" | "Apartamento") | undefined;
        return {
          ...p,
          deliveryAddress: address,
          deliveryReferencePoint: referencePoint,
          deliveryType: typedType,
          deliveryApartmentNumber: apartmentNumber,
          deliveryFloor: floor,
          deliveryAccess: typedAccess,
          deliveryStatus: "Pendente" as const,
          updatedAt: now,
          history: [entry, ...p.history],
        };
      });
      try {
        const updated = newProducts.find(np => np.id === id);
        // eslint-disable-next-line no-console
        console.log('[Inventory] setDeliveryInfo called', { id, address, user, referencePoint, type, apartmentNumber, floor, access, updated });
      } catch (e) {
        // ignore
      }
      return newProducts;
    });
  }, []);

  const markDelivered = useCallback((id: string, user: SystemUser) => {
    const now = new Date().toISOString();
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const entry: HistoryEntry = {
        id: `h-${Date.now()}`,
        action: "STATUS_CHANGED",
        user,
        timestamp: now,
        details: { 
          oldStatus: p.deliveryStatus || "Pendente",
          newStatus: "Entregue",
          reason: "Entregue ao cliente" 
        },
      };
      return {
        ...p,
        deliveryStatus: "Entregue",
        deliveredAt: now,
        updatedAt: now,
        history: [entry, ...p.history],
      };
    }));
  }, []);

  const scheduleDelivery = useCallback((id: string, scheduledDate: string, user: SystemUser) => {
    const now = new Date().toISOString();
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const entry: HistoryEntry = {
        id: `h-${Date.now()}`,
        action: "STATUS_CHANGED",
        user,
        timestamp: now,
        details: { 
          oldStatus: p.deliveryStatus || "Pendente",
          newStatus: "Agendada",
          reason: `Entrega agendada para ${scheduledDate}`
        },
      };
      return {
        ...p,
        deliveryStatus: "Agendada",
        scheduledDeliveryDate: scheduledDate,
        updatedAt: now,
        history: [entry, ...p.history],
      };
    }));
  }, []);

  const transferProduct = useCallback((id: string, newUnit: StoreUnit, user: SystemUser, reason?: string) => {
    const now = new Date().toISOString();
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const entry: HistoryEntry = {
        id: `h-${Date.now()}`,
        action: "TRANSFERRED",
        user,
        timestamp: now,
        details: {
          oldUnit: p.unit,
          newUnit: newUnit,
          reason: reason || `Transferido de ${p.unit} para ${newUnit}`,
        },
      };
      return { ...p, unit: newUnit, updatedAt: now, history: [entry, ...p.history] };
    }));
  }, []);

  const deleteProduct = useCallback((id: string, user: SystemUser): boolean => {
    // Apenas admins podem deletar (qualquer um por enquanto)
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  }, []);

  const getProductsByUnit = useCallback((unit: StoreUnit) => products.filter(p => p.unit === unit), [products]);
  const getProductsByStatus = useCallback((status: ProductStatus) => products.filter(p => p.status === status), [products]);

  const stats = {
    total: products.length,
    available: products.filter(p => p.status === "Disponível").length,
    sold: products.filter(p => p.status === "Vendido").length,
    ordered: products.filter(p => p.status === "Pedido").length,
    reserved: products.filter(p => p.status === "Reservado").length,
    pendingDeliveries: products.filter(p => p.deliveryAddress && p.deliveryStatus === "Pendente").length,
    assistanceCount: products.filter(p => p.status === "Assistência").length,
    byUnit: {
      "Shopping Praça Nova": products.filter(p => p.unit === "Shopping Praça Nova").length,
      "Camobi": products.filter(p => p.unit === "Camobi").length,
      "Estoque": products.filter(p => p.unit === "Estoque").length,
    } as Record<StoreUnit, number>,
  };

  return (
    <InventoryContext.Provider value={{
      products, addProduct, updateProduct, updateProductStatus, transferProduct, deleteProduct,
      getProductsByUnit, getProductsByStatus, stats, setDeliveryInfo, markDelivered, scheduleDelivery,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be inside InventoryProvider");
  return ctx;
};

