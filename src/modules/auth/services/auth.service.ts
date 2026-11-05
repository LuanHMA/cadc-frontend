import { api } from "../../../shared/lib/api"
import type { LoginResponse, LoginSchemaType } from "../contracts/login.contract"
import type { User } from "../contracts/session.contract"

export const authService = {
    login(body: LoginSchemaType) {
        return api.post<LoginResponse>("/auth/login", {
            body,
            isPublic: true,
        })
    },

    me() {
        return api.get<User>("/auth/me")
    },

    logout() {
        return api.post("/auth/logout")
    },
}
