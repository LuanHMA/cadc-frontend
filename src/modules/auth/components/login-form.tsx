import { Button, Input } from "../../../shared/components/ui";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
    const { handleSubmit, control, onLogin, isSubmitting } = useLogin()

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onLogin)}>
            <Input type="email" placeholder="Email" control={control} name="email" />
            <Input type="password" placeholder="Senha" control={control} name="password" />
            <Button type="submit" className="w-full" loading={isSubmitting} >Entrar</Button>
        </form>
    )
}