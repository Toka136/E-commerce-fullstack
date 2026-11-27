"use client";
import  QRCode from "qrcode";
import { useEffect, useState } from "react";

type Props = {
  value: string;
};

export default function PaymentQRCode({ value }: Props) {
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then(setQrImage)
      .catch(setError);
  }, [value]);

  if (!qrImage) return <p>Generating QR Code...</p>;
  if(error) return <p>{error}</p>
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={qrImage}
        alt="Wallet payment QR Code"
        width={256}
        height={256}
      />

      <p className="text-sm text-gray-500">
        Scan this QR Code using your wallet application.
      </p>
    </div>
  );
}