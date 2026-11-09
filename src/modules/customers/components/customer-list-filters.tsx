import { Search } from "lucide-react";
import { Input } from "../../../shared/components/ui";

type CustomerListFiltersProps = {
    page: number
    name: string
    phone: string
    onNameChange: (value: string) => void
    onPhoneChange: (value: string) => void
}

export function CustomerListFilters({ name, phone, onNameChange, onPhoneChange }: CustomerListFiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-xl">
            <Input
                type="search"
                label="Nome"
                placeholder="Buscar por nome"
                value={name}
                leftIcon={<Search />}
                onChange={(event) => onNameChange(event.target.value)}
            />
            <Input
                type="search"
                label="Telefone"
                placeholder="Buscar por telefone"
                inputMode="tel"
                value={phone}
                leftIcon={<Search />}
                onChange={(event) => onPhoneChange(event.target.value)}
            />
        </div>
    )
}