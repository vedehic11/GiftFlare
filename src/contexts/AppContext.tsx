import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Seller, Theme, DeliveryCity } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  products: Product[];
  sellers: Seller[];
  deliveryCities: DeliveryCity[];
  currentTheme: Theme;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'sellerName'>) => Promise<boolean>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<boolean>;
  updateDeliveryCity: (cityId: string, isActive: boolean) => Promise<boolean>;
  updateTheme: (themeName: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const defaultTheme: Theme = {
  name: 'default',
  colors: {
    primary: '#ed7bb4',
    secondary: '#fab9db',
    accent: '#FDE047'
  },
  isActive: true
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [deliveryCities, setDeliveryCities] = useState<DeliveryCity[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchDeliveryCities(),
        fetchCurrentTheme()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles!products_seller_id_fkey (
            name,
            is_verified
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        sellerId: product.seller_id,
        sellerName: product.profiles?.name || 'Unknown Seller',
        name: product.name,
        price: product.price / 100, // Convert from paise to rupees
        image: product.image_url || 'https://images.pexels.com/photos/1030303/pexels-photo-1030303.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: product.description,
        videoUrl: product.video_url || undefined,
        city: product.city,
        instantDeliveryEligible: product.instant_delivery_eligible,
        status: product.status,
        category: product.category,
        tags: product.tags,
        createdAt: product.created_at
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error in fetchProducts:', error);
    }
  };

  const fetchDeliveryCities = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_cities')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching delivery cities:', error);
        return;
      }

      const formattedCities: DeliveryCity[] = data.map(city => ({
        id: city.id,
        name: city.name,
        isActive: city.is_active
      }));

      setDeliveryCities(formattedCities);
    } catch (error) {
      console.error('Error in fetchDeliveryCities:', error);
    }
  };

  const fetchCurrentTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching theme:', error);
        return;
      }

      if (data) {
        setCurrentTheme({
          name: data.name,
          colors: data.colors as { primary: string; secondary: string; accent: string },
          isActive: data.is_active
        });
      }
    } catch (error) {
      console.error('Error in fetchCurrentTheme:', error);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'sellerName'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          seller_id: productData.sellerId,
          name: productData.name,
          price: productData.price * 100, // Convert to paise
          image_url: productData.image,
          description: productData.description,
          video_url: productData.videoUrl,
          city: productData.city,
          instant_delivery_eligible: productData.instantDeliveryEligible,
          category: productData.category,
          tags: productData.tags
        });

      if (error) {
        console.error('Error adding product:', error);
        return false;
      }

      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error in addProduct:', error);
      return false;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      const dbUpdates: any = {};
      
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.price) dbUpdates.price = updates.price * 100; // Convert to paise
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.image) dbUpdates.image_url = updates.image;
      if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
      if (updates.instantDeliveryEligible !== undefined) dbUpdates.instant_delivery_eligible = updates.instantDeliveryEligible;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.tags) dbUpdates.tags = updates.tags;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', productId);

      if (error) {
        console.error('Error updating product:', error);
        return false;
      }

      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      return false;
    }
  };

  const updateDeliveryCity = async (cityId: string, isActive: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('delivery_cities')
        .update({ is_active: isActive })
        .eq('id', cityId);

      if (error) {
        console.error('Error updating delivery city:', error);
        return false;
      }

      await fetchDeliveryCities();
      return true;
    } catch (error) {
      console.error('Error in updateDeliveryCity:', error);
      return false;
    }
  };

  const updateTheme = async (themeName: string): Promise<boolean> => {
    try {
      // First, deactivate all themes
      await supabase
        .from('themes')
        .update({ is_active: false })
        .neq('id', '');

      // Then activate the selected theme
      const { error } = await supabase
        .from('themes')
        .update({ is_active: true })
        .eq('name', themeName);

      if (error) {
        console.error('Error updating theme:', error);
        return false;
      }

      await fetchCurrentTheme();
      return true;
    } catch (error) {
      console.error('Error in updateTheme:', error);
      return false;
    }
  };

  // Mock sellers data for now (can be implemented later if needed)
  const addSeller = async (seller: Seller) => {
    // Implementation would go here
  };

  const updateSeller = async (sellerId: string, updates: Partial<Seller>) => {
    // Implementation would go here
  };

  return (
    <AppContext.Provider value={{
      products,
      sellers,
      deliveryCities,
      currentTheme,
      addProduct,
      updateProduct,
      updateDeliveryCity,
      updateTheme,
      refreshData,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};