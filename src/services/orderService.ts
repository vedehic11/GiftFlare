import { supabase } from '../lib/supabase';
import { emailService } from './emailService';
import { smsService } from './smsService';
import { CartItem } from '../contexts/CartContext';

export interface OrderData {
  id: string;
  user_id: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_type: 'standard' | 'instant';
  delivery_address: any;
  friend_delivery?: any;
  tracking_number?: string;
  estimated_delivery?: string;
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

class OrderService {
  async createOrder(orderData: {
    userId: string;
    items: CartItem[];
    totalAmount: number;
    deliveryType: 'standard' | 'instant';
    deliveryAddress: any;
    friendDelivery?: any;
    paymentIntentId?: string;
  }): Promise<OrderData | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          items: orderData.items,
          total_amount: orderData.totalAmount * 100, // Convert to paise
          delivery_type: orderData.deliveryType,
          delivery_address: orderData.deliveryAddress,
          friend_delivery: orderData.friendDelivery,
          payment_intent_id: orderData.paymentIntentId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        return null;
      }

      // Send confirmation communications
      await this.sendOrderConfirmation(data);

      return data;
    } catch (error) {
      console.error('Error in createOrder:', error);
      return null;
    }
  }

  async updateOrderStatus(
    orderId: string, 
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
    trackingNumber?: string
  ): Promise<boolean> {
    try {
      // Use the database function to update status and create notification
      const { error } = await supabase.rpc('update_order_status', {
        p_order_id: orderId,
        p_status: status,
        p_tracking_number: trackingNumber
      });

      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      // Get updated order data for communications
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (
            name,
            email
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderData) {
        await this.sendStatusUpdateCommunications(orderData, status, trackingNumber);
      }

      return true;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      return false;
    }
  }

  private async sendOrderConfirmation(orderData: OrderData) {
    try {
      // Get user details
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', orderData.user_id)
        .single();

      if (!userProfile) return;

      // Send email confirmation
      await emailService.sendOrderConfirmation(
        orderData,
        userProfile.email,
        orderData.user_id
      );

      // Send SMS confirmation (if phone number available in delivery address)
      const phoneNumber = orderData.delivery_address?.phone;
      if (phoneNumber) {
        await smsService.sendOrderConfirmationSMS(
          orderData.id,
          orderData.total_amount,
          phoneNumber,
          orderData.user_id
        );
      }
    } catch (error) {
      console.error('Error sending order confirmation:', error);
    }
  }

  private async sendStatusUpdateCommunications(
    orderData: any,
    status: string,
    trackingNumber?: string
  ) {
    try {
      const userEmail = orderData.profiles?.email;
      const phoneNumber = orderData.delivery_address?.phone;

      if (!userEmail) return;

      switch (status) {
        case 'shipped':
          if (trackingNumber) {
            await emailService.sendShippingUpdate(
              orderData,
              trackingNumber,
              userEmail,
              orderData.user_id
            );

            if (phoneNumber) {
              if (orderData.delivery_type === 'instant') {
                await smsService.sendInstantDeliveryUpdateSMS(
                  orderData.id,
                  phoneNumber,
                  orderData.user_id
                );
              } else {
                await smsService.sendShippingUpdateSMS(
                  orderData.id,
                  trackingNumber,
                  phoneNumber,
                  orderData.user_id
                );
              }
            }
          }
          break;

        case 'delivered':
          await emailService.sendDeliveryConfirmation(
            orderData,
            userEmail,
            orderData.user_id
          );

          if (phoneNumber) {
            await smsService.sendDeliveryConfirmationSMS(
              orderData.id,
              phoneNumber,
              orderData.user_id
            );
          }
          break;
      }
    } catch (error) {
      console.error('Error sending status update communications:', error);
    }
  }

  async getOrdersByUser(userId: string): Promise<OrderData[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getOrdersByUser:', error);
      return [];
    }
  }

  async getOrderById(orderId: string): Promise<OrderData | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return null;
    }
  }

  // Simulate Dunzo integration for instant delivery
  async bookDunzoDelivery(orderData: OrderData): Promise<{ success: boolean; trackingId?: string }> {
    try {
      // Simulate Dunzo API call
      console.log('Booking Dunzo delivery for order:', orderData.id);
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const trackingId = `DUNZO${Date.now()}`;
      
      // Update order with tracking number
      await this.updateOrderStatus(orderData.id, 'shipped', trackingId);
      
      return { success: true, trackingId };
    } catch (error) {
      console.error('Error booking Dunzo delivery:', error);
      return { success: false };
    }
  }
}

export const orderService = new OrderService();