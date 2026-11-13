import axios, { type AxiosError, type AxiosRequestConfig, type Method } from "axios"

declare module "axios" {
  interface AxiosRequestConfig {
    isPublic?: boolean
    _retry?: boolean
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>

export type ApiRequestOptions<TBody = unknown> = {
  query?: Record<string, QueryParamValue>
  params?: Record<string, string | number>
  body?: TBody
  isPublic?: boolean
  headers?: AxiosRequestConfig["headers"]
  signal?: AbortSignal
}

const LOGIN_PATH = "/entrar"

let refreshPromise: Promise<boolean> | null = null

function applyPathParams(
  url: string,
  params: Record<string, string | number> | undefined,
) {
  if (!params) return url

  return url.replace(/:([A-Za-z0-9_]+)/g, (match, key: string) => {
    const value = params[key]
    if (value === undefined) return match
    return encodeURIComponent(String(value))
  })
}

function appendQueryValue(
  search: URLSearchParams,
  key: string,
  value: QueryParamValue,
) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (item == null) continue
      search.append(key, String(item))
    }
    return
  }

  if (value == null) return
  search.append(key, String(value))
}

function appendQuery(
  url: string,
  query: Record<string, QueryParamValue> | undefined,
) {
  if (!query) return url

  const hashIndex = url.indexOf("#")
  const withoutHash = hashIndex === -1 ? url : url.slice(0, hashIndex)
  const hash = hashIndex === -1 ? "" : url.slice(hashIndex)
  const questionIndex = withoutHash.indexOf("?")
  const path =
    questionIndex === -1 ? withoutHash : withoutHash.slice(0, questionIndex)
  const existing =
    questionIndex === -1 ? "" : withoutHash.slice(questionIndex + 1)
  const search = new URLSearchParams(existing)

  for (const [key, value] of Object.entries(query)) {
    appendQueryValue(search, key, value)
  }

  const serialized = search.toString()
  return serialized ? `${path}?${serialized}${hash}` : `${path}${hash}`
}

async function request<TResponse, TBody = unknown>(
  method: Method,
  url: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> {
  const { query, params, body, isPublic = false, headers, signal } = options
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData

  const response = await apiClient.request<TResponse>({
    method,
    url: appendQuery(applyPathParams(url, params), query),
    data: body,
    signal,
    isPublic,
    headers: {
      ...(body !== undefined && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
  })

  return response.data
}

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = request<unknown>("POST", "/auth/refresh", { isPublic: true })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config
    if (!config || config.isPublic || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (!config._retry) {
      config._retry = true
      if (await refreshSession()) return apiClient.request(config)
    }

    if (window.location.pathname !== LOGIN_PATH) window.location.href = LOGIN_PATH
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback

  const message = error.response?.data?.message
  if (typeof message === "string" && message.length > 0) return message
  if (Array.isArray(message) && typeof message[0] === "string") return message[0]
  return fallback
}

function createMethod(method: Method) {
  return <TResponse, TBody = unknown>(
    url: string,
    options?: ApiRequestOptions<TBody>,
  ) => request<TResponse, TBody>(method, url, options)
}

export const api = {
  get: createMethod("GET"),
  post: createMethod("POST"),
  put: createMethod("PUT"),
  patch: createMethod("PATCH"),
  delete: createMethod("DELETE"),
}
