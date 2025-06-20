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
import { showToast } from "../../utils/foodHelpers";
import { paymentService, PaymentIntentResponse, ConfirmPaymentResponse } from "../../services/paymentService";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || "");

interface PaymentGatewayProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentResult: ConfirmPaymentResponse) => void;
  onError: (error: string) => void;
  customerEmail?: string;
  orderId: string;
  enableStripe?: boolean;
}

interface StripeCheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess: (paymentResult: ConfirmPaymentResponse) => void;
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
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);

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
      // Create payment intent through our service
      const paymentIntentResponse = await paymentService.createPaymentIntent({
        amount,
        currency: currency.toLowerCase(),
        orderId,
        customerEmail,
        paymentMethodId: 'pm_card_visa',
      });

      setPaymentIntent(paymentIntentResponse);

      // Confirm payment on our backend
      const confirmResponse = await paymentService.confirmPayment({
        paymentIntentId: paymentIntentResponse.paymentIntentId,
      });

      // Payment successful
      onSuccess(confirmResponse);
      showToast.success("Payment processed successfully!");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Payment processing failed");
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

// Main Payment Gateway Component
const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  currency = "VND",
  onSuccess,
  onError,
  customerEmail,
  orderId,
}) => {
  const stripeOptions: StripeElementsOptions = {
    appearance: {
      theme: "stripe",
    },
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
      </CardContent>
    </Card>
  );
};

export default PaymentGateway; 