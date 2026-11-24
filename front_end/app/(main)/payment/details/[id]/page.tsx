import { getPaymenDetails } from "@/features/orders/api/getPaymentDetails";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function PaymentDetails({ params }: Params) {
  const { id } = await params;

  const response = await getPaymenDetails(id);
  const payment = response.data;

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="rounded-xl border p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">
          Complete Your Payment
        </h1>

        <p className="mb-6 text-gray-500">
          Your order has been created successfully. Please complete your
          payment using the details below.
        </p>

        <div className="mb-6 flex justify-between">
          <span>Payment Amount</span>
          <span className="font-bold">{payment.amount} EGP</span>
        </div>

        {/* Fawry */}
        {payment.referenceNumber && (
          <div className="rounded-lg bg-gray-100 p-4">
            <h2 className="mb-2 font-semibold">
              Fawry Reference Number
            </h2>

            <p className="text-xl font-bold tracking-wider">
              {payment.referenceNumber}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Use this reference number to complete your payment.
            </p>
          </div>
        )}

        {/* Wallet QR */}
        {payment.isoQr && (
          <div className="flex flex-col items-center rounded-lg bg-gray-100 p-4">
            <h2 className="mb-4 font-semibold">
              Scan QR Code to Pay
            </h2>

            <img
              src={payment.isoQr}
              alt="Payment QR Code"
              className="h-56 w-56 object-contain"
            />
          </div>
        )}

        {payment.expireDate && (
          <p className="mt-6 text-sm text-red-500">
            Payment expires at:{" "}
            {new Date(payment.expireDate).toLocaleString("en-EG")}
          </p>
        )}

        <p className="mt-6 text-sm text-gray-500">
          Your order status will be updated automatically after successful
          payment confirmation.
        </p>
      </div>
    </main>
  );
}