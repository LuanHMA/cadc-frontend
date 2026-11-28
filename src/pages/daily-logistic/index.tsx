import { Link } from "react-router";
import { Button } from "../../shared/components/ui";
import { ClipboardList } from "lucide-react";

export function DailyLogisticPage() {
    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-start gap-1">
                    <h1 className="text-2xl font-semibold text-content-primary">Logística Diária</h1>
                    <p className="text-sm text-content-primary">Acompanhe os pedidos do dia</p>
                </div>

                <Link to="/pedidos">
                    <Button leftIcon={<ClipboardList />}>
                        Ver pedidos
                    </Button>
                </Link>
            </div>


        </div>
    )
}