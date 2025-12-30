"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Truck, Check, ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Define the checkout steps
type CheckoutStep = "shipping" | "payment" | "confirmation";

// Define form state types
interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentFormData {
  cardName: string;
}

// Card Element styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '12px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

// Payment Form Component
function PaymentForm({ 
  shippingData, 
  paymentData, 
  setPaymentData, 
  onPaymentSuccess, 
  onBack, 
  orderTotal,
  items 
}: {
  shippingData: ShippingFormData;
  paymentData: PaymentFormData;
  setPaymentData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
  onPaymentSuccess: (paymentIntent: any) => void;
  onBack: () => void;
  orderTotal: number;
  items: any[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(orderTotal * 100), // Convert to cents
          items,
          shippingInfo: shippingData,
        }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentData.cardName,
            email: shippingData.email,
            phone: shippingData.phone,
            address: {
              line1: shippingData.address,
              city: shippingData.city,
              state: shippingData.state,
              postal_code: shippingData.zipCode,
              country: shippingData.country === 'United States' ? 'US' : 'US', // Map country codes
            },
          },
        },
        // Remove shipping from here since it's already set on the server
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'An error occurred while processing your payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
      
      <form onSubmit={handlePaymentSubmit}>
        <div className="mb-6">
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
            Name on Card *
          </label>
          <input
            type="text"
            id="cardName"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
            value={paymentData.cardName}
            onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
            placeholder="John Doe"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Information *
          </label>
          <div className="border rounded-md p-4 focus-within:ring-2 focus-within:ring-[#C5A464] focus-within:border-[#C5A464]">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your payment information is secure and encrypted.
          </p>
        </div>

        {paymentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{paymentError}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition flex items-center disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Shipping
          </button>
          
          <button
            type="submit"
            disabled={isProcessing || !stripe}
            className="bg-[#C5A464] text-white py-3 px-6 rounded-md hover:bg-[#B39355] transition flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                Complete Order - ${orderTotal.toFixed(2)}
                <ChevronRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, clearCart, itemCount } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  
  // Calculate subtotal (same as total from context)
  const subtotal = total;
  
  // Form state
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardName: "",
  });

  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">You need to add items to your cart before checking out.</p>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center bg-[#C5A464] text-white py-3 px-6 rounded-md hover:bg-[#B39355] transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculate order totals
  const shipping = 5.99;
  const tax = subtotal * 0.07;
  const orderTotal = subtotal + shipping + tax;

  // Stripe Elements options
  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#C5A464',
      },
    },
  };

  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
    window.scrollTo(0, 0);
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentIntentResult: any) => {
    setPaymentIntent(paymentIntentResult);
    setCurrentStep("confirmation");
    window.scrollTo(0, 0);
  };

  // Handle order completion
  const handleCompleteOrder = () => {
    clearCart();
    router.push("/shop");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Checkout Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-[#C5A464] transition mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Checkout Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation" 
                  ? "bg-[#C5A464] text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}>
                {currentStep === "shipping" ? <Truck className="w-5 h-5" /> : <Check className="w-5 h-5" />}
              </div>
              <span className="text-sm mt-2">Shipping</span>
            </div>
            
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${
                currentStep === "payment" || currentStep === "confirmation" ? "bg-[#C5A464]" : "bg-gray-200"
              }`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === "payment" || currentStep === "confirmation" 
                  ? "bg-[#C5A464] text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}>
                {currentStep === "payment" && !currentStep.includes("confirmation") ? <CreditCard className="w-5 h-5" /> : (
                  currentStep === "confirmation" ? <Check className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm mt-2">Payment</span>
            </div>
            
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${
                currentStep === "confirmation" ? "bg-[#C5A464]" : "bg-gray-200"
              }`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === "confirmation" 
                  ? "bg-[#C5A464] text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}>
                {currentStep === "confirmation" ? <Check className="w-5 h-5" /> : "3"}
              </div>
              <span className="text-sm mt-2">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Shipping Information Step */}
              {currentStep === "shipping" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                  
                  <form onSubmit={handleShippingSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                          value={shippingData.firstName}
                          onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                          value={shippingData.lastName}
                          onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                          value={shippingData.email}
                          onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          id="state"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                          value={shippingData.state}
                          onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP/Postal Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                          value={shippingData.zipCode}
                          onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        id="country"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                        value={shippingData.country}
                        onChange={(e) => setShippingData({...shippingData, country: e.target.value})}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#C5A464] text-white py-3 px-6 rounded-md hover:bg-[#B39355] transition flex items-center"
                      >
                        Continue to Payment
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Payment Information Step */}
              {currentStep === "payment" && (
                <Elements stripe={stripePromise} options={elementsOptions}>
                  <PaymentForm
                    shippingData={shippingData}
                    paymentData={paymentData}
                    setPaymentData={setPaymentData}
                    onPaymentSuccess={handlePaymentSuccess}
                    onBack={() => setCurrentStep("shipping")}
                    orderTotal={orderTotal}
                    items={items}
                  />
                </Elements>
              )}
              
              {/* Order Confirmation Step */}
              {currentStep === "confirmation" && (
                <div className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h2>
                  <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block">
                    <p className="text-sm text-gray-500">Payment ID:</p>
                    <p className="text-lg font-semibold text-gray-900">{paymentIntent?.id}</p>
                  </div>
                  
                  <div className="mb-8 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                    
                    <div className="border-t border-b py-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Shipping Address:</span>
                        <span className="text-gray-900 text-right">
                          {shippingData.address}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}, {shippingData.country}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="text-gray-900 text-right">
                          {shippingData.email} | {shippingData.phone}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      We've sent a confirmation email to <span className="font-semibold">{shippingData.email}</span> with all the details of your order.
                    </p>
                    
                    <p className="text-gray-600">
                      If you have any questions about your order, please contact our customer support team.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleCompleteOrder}
                    className="bg-[#C5A464] text-white py-3 px-6 rounded-md hover:bg-[#B39355] transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="max-h-80 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-start py-3 border-b">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative mr-4">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-[#C5A464]">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {currentStep !== "confirmation" && (
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                  <p className="mb-2">
                    <span className="font-semibold">Secure Checkout:</span> All transactions are secure and encrypted.
                  </p>
                  <p>
                    <span className="font-semibold">Shipping Policy:</span> Orders typically ship within 1-2 business days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}