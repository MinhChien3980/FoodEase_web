import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { showToast } from "../../utils/foodHelpers";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "");

interface PaymentGatewayProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
  customerEmail?: string;
  orderId: string;
  enableStripe?: boolean;
  enablePayPal?: boolean;
}

interface StripeCheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
  customerEmail?: string;
  orderId: string;
}

// Stripe Checkout Form Component
const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  amount,
  currency,
  onSuccess,
  onError,
  customerEmail,
  orderId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError("Card element not found");
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          email: customerEmail,
        },
      });

      if (error) {
        onError(error.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      // Here you would typically call your backend to create a payment intent
      // For demo purposes, we'll simulate a successful payment
      const paymentResult = {
        paymentMethod: paymentMethod,
        orderId: orderId,
        amount: amount,
        currency: currency,
        status: "succeeded",
      };

      onSuccess(paymentResult);
      showToast.success("Payment processed successfully!");
    } catch (err) {
      onError("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <CardElement options={cardElementOptions} />
      </Box>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || isProcessing}
        startIcon={isProcessing ? <CircularProgress size={20} /> : undefined}
      >
        {isProcessing ? "Processing..." : `Pay ${currency}${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};

// PayPal Checkout Component
const PayPalCheckout: React.FC<{
  amount: number;
  currency: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
  orderId: string;
}> = ({ amount, currency, onSuccess, onError, orderId }) => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: currency,
          },
          reference_id: orderId,
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      const paymentResult = {
        orderID: data.orderID,
        payerID: data.payerID,
        paymentDetails: details,
        orderId: orderId,
        amount: amount,
        currency: currency,
        status: "completed",
      };
      
      onSuccess(paymentResult);
      showToast.success("PayPal payment completed successfully!");
    } catch (err) {
      onError("PayPal payment failed");
    }
  };

  const onErrorHandler = (err: any) => {
    console.error("PayPal error:", err);
    onError("PayPal payment error occurred");
  };

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isRejected) {
    return (
      <Alert severity="error">
        PayPal failed to load. Please try again later.
      </Alert>
    );
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onErrorHandler}
      style={{
        layout: "vertical",
        color: "blue",
        shape: "rect",
        label: "paypal",
      }}
    />
  );
};

// Main Payment Gateway Component
const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  currency = "USD",
  onSuccess,
  onError,
  customerEmail,
  orderId,
  enableStripe = true,
  enablePayPal = true,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "stripe" | "paypal" | null
  >(null);

  const stripeOptions: StripeElementsOptions = {
    appearance: {
      theme: "stripe",
    },
  };

  const paypalOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "",
    currency: currency,
    intent: "capture",
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Order Amount: <strong>{currency} {amount.toFixed(2)}</strong>
        </Typography>

        {!selectedPaymentMethod && (
          <Grid container spacing={2}>
            {enableStripe && (
              <Grid item xs={12} sm={enablePayPal ? 6 : 12}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setSelectedPaymentMethod("stripe")}
                  sx={{ p: 2 }}
                >
                  Pay with Card
                </Button>
              </Grid>
            )}
            {enablePayPal && (
              <Grid item xs={12} sm={enableStripe ? 6 : 12}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setSelectedPaymentMethod("paypal")}
                  sx={{ p: 2 }}
                >
                  Pay with PayPal
                </Button>
              </Grid>
            )}
          </Grid>
        )}

        {selectedPaymentMethod && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Button
                variant="text"
                onClick={() => setSelectedPaymentMethod(null)}
                size="small"
              >
                ← Back to payment methods
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }} />

            {selectedPaymentMethod === "stripe" && enableStripe && (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <StripeCheckoutForm
                  amount={amount}
                  currency={currency}
                  onSuccess={onSuccess}
                  onError={onError}
                  customerEmail={customerEmail}
                  orderId={orderId}
                />
              </Elements>
            )}

            {selectedPaymentMethod === "paypal" && enablePayPal && (
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalCheckout
                  amount={amount}
                  currency={currency}
                  onSuccess={onSuccess}
                  onError={onError}
                  orderId={orderId}
                />
              </PayPalScriptProvider>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentGateway; 