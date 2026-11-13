import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { getApiErrorMessage } from "../../../shared/lib/api"
import { LoginSchema, type LoginSchemaType } from "../contracts/login.contract"
import { authService } from "../services/auth.service"
import { useSession } from "./use-session"

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { establishSession } = useSession()
  const { handleSubmit, control, formState: { isSubmitting } } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  })

  const onLogin = async (data: LoginSchemaType) => {
    try {
      const response = await authService.login(data)

      establishSession(response.user)
      toast.success(response.message)

      // Redireciona para a última página visitada ou para a página inicial
      const from = (location.state as { lastPathVisited?: string } | null)?.lastPathVisited
      navigate(from && from !== "/entrar" ? from : "/", { replace: true })
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível entrar. Tente novamente mais tarde."))
    }
  }

  return {
    handleSubmit,
    control,
    isSubmitting,
    onLogin,
  }
}
