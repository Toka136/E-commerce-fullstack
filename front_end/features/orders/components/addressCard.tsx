import { MapPin, Phone } from "lucide-react"
import { Card } from "./Card"
import { ShippingFormValues } from "../types/orders"

export const OrderAddressCard = ({address}:{address:ShippingFormValues}) => {
    return (
        <Card title="Shipping address" icon={MapPin}>
            <address className="space-y-0.5 text-sm not-italic text-on-surface">
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
            </address>
            <p className="mt-3 flex items-center gap-2 text-sm text-on-surface-variant">
              <Phone className="h-3.5 w-3.5" />
              <span dir="ltr">{address.mobile}</span>
            </p>
          </Card>
    )
}