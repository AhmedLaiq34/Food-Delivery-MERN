import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../services/cartApi';
import { HiOutlineLocationMarker, HiOutlineCreditCard, HiCheckCircle } from 'react-icons/hi';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Initialize Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

function CheckoutForm({ cart }: { cart: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // 1. Place the order to get an order ID
      const orderResponse = await api.post('/orders', {
        restaurantId: cart.restaurant,
        deliveryAddress: {
          street: '123 Main St', // Hardcoded for demo, normally from a form
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        paymentMethod: 'stripe',
        isDelivery: true
      });

      const orderId = orderResponse.data.data._id;

      // 2. Create Payment Intent
      const intentResponse = await api.post('/payments/create-intent', { orderId });
      const { clientSecret } = intentResponse.data.data;

      // 3. Confirm Payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <PaymentElement />
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
      >
        {isProcessing ? 'Processing...' : `Pay $${cart.total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;
  
  const cart = data?.data;

  if (!cart || cart.items.length === 0) {
    return <div className="p-10 text-center">Your cart is empty</div>;
  }

  // We are bypassing elements if we use a simplified flow, but here is a standard integration:
  // In a real scenario, you'd fetch the clientSecret FIRST and pass it to Elements options
  // But for this UI, we will just use a generic Elements wrapper, and fetch the secret inside the form on submit
  // Actually, Stripe Elements requires clientSecret on load for the new PaymentElement. 
  // For the sake of the exercise, we can render the card element or just a mock button if env vars aren't set.

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl font-bold text-dark mb-8">Checkout</h1>
        
        {/* Delivery Address section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-2 rounded-lg text-primary mr-3">
              <HiOutlineLocationMarker className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-dark">Delivery Address</h2>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-gray-200">
            <p className="font-semibold text-dark">Home</p>
            <p className="text-gray-500 text-sm mt-1">123 Main St, Anytown, CA 12345, USA</p>
          </div>
        </div>

        {/* Payment section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-dark text-white p-2 rounded-lg mr-3">
              <HiOutlineCreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-dark">Payment Method</h2>
          </div>
          
          {import.meta.env.VITE_STRIPE_PUBLIC_KEY ? (
            <Elements stripe={stripePromise} options={{ mode: 'payment', amount: Math.round(cart.total * 100), currency: 'usd' }}>
              <CheckoutForm cart={cart} />
            </Elements>
          ) : (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200">
              <p className="font-semibold flex items-center"><HiCheckCircle className="w-5 h-5 mr-2"/> Stripe Sandbox Mode</p>
              <p className="text-sm mt-2">Stripe keys are not configured. Click below to bypass payment and place order.</p>
              <button 
                onClick={async () => {
                  try {
                    await api.post('/orders', {
                      restaurantId: cart.restaurant,
                      deliveryAddress: { street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '12345', country: 'USA' },
                      paymentMethod: 'cod',
                      isDelivery: true
                    });
                    toast.success('Order placed via Cash on Delivery!');
                    window.location.href = '/orders';
                  } catch (err) {
                    toast.error('Failed to place order');
                  }
                }}
                className="w-full mt-4 bg-dark text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
              >
                Place Order (Bypass Payment)
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="bg-surface rounded-3xl p-8 sticky top-24 border border-gray-200">
          <h2 className="text-2xl font-bold text-dark mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.items.map((item: any) => (
              <div key={item._id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-bold text-dark bg-white border border-gray-200 w-8 h-8 flex items-center justify-center rounded-lg text-sm mr-3">
                    {item.quantity}x
                  </span>
                  <span className="text-gray-600 font-medium">{item.menuItem?.name}</span>
                </div>
                <span className="font-bold text-dark">${item.itemTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-4 space-y-3 text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-dark">${cart.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span className="font-medium text-dark">${cart.deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span className="font-medium text-dark">${cart.tax.toFixed(2)}</span></div>
          </div>
          <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-dark">Total</span>
            <span className="text-3xl font-black text-primary">${cart.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
