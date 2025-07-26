// components/TipPaymentForm.jsx
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";

const TipPaymentForm = ({ tipAmount, onClose, receiverId, tipperId, messageId,createTipPaymentIntent, saveTip }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

 const handleSendTip = async () => {
    if (!stripe || !elements) return;

    if (!tipAmount || isNaN(tipAmount) || Number(tipAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const clientSecret = await createTipPaymentIntent({
        amount: parseFloat(tipAmount),
        tipperId,
        receiverId,
      });

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // Payment succeeded — now save tip to DB
        const savedTip = await saveTip({
          amount: parseFloat(tipAmount),
          tipperId,
          receiverId,
          messageId
        });

        if (savedTip) {
          toast.success("Tip sent and saved successfully!");
          onClose();
        } else {
          toast.error("Tip sent but failed to save tip record.");
        }
      }
    } catch (err) {
      toast.error("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <CardElement className="border p-3 rounded" />
      <div className="flex justify-center w-full items-center">
         <button
        onClick={handleSendTip}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white w-full rounded hover:bg-blue-700 flex justify-center items-center disabled:opacity-50 transition"
      >
        {loading ? "Processing..." : `Send Rs.${tipAmount}`}
      </button>
      </div>
     
    </div>
  );
};

export default TipPaymentForm;
