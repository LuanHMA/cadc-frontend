import type { Control } from "react-hook-form"
import { Input } from "../../../shared/components/ui"
import { MesquitaAddressFields } from "../../../shared/components/ui/mesquita-address-fields"
import { PhoneInput } from "../../../shared/components/ui/phone-input"
import type { CustomerFormSchemaType } from "../contracts/customers-contracts"

export function CustomerFormFields({ control }: { control: Control<CustomerFormSchemaType> }) {
    return (
        <>
            <Input label="Nome" placeholder="Nome do cliente" control={control} name="name" />
            <PhoneInput label="Telefone" control={control} name="phone" />
            <MesquitaAddressFields control={control} />
            <Input label="Ponto de referência" placeholder="Ponto de referência" control={control} name="complement" />
        </>
    )
}
