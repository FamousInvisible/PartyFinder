import { HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, switchMap, throwError } from "rxjs";

let isRefreshing = false

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const token = authService.token

    if (!token) return next(req)

    if (isRefreshing){
        return refresAndProcced(authService, req, next)
    }


    return next(addToken(req, token))
    .pipe(
        catchError(error => {
            if (error.status === 403){
                console.log("Протух токен!")
                return refresAndProcced(authService, req, next)
            }

            return throwError(error)
        })
    )
}


const refresAndProcced = (
    authService: AuthService,
    req:HttpRequest<any>,
    next:HttpHandlerFn
) => {
    if (!isRefreshing){
        isRefreshing = true
        console.log("Обновляем токен...")
        return authService.refreshAuthToken()
        .pipe(
            switchMap( res => {
                isRefreshing = false
                console.log("Переходим в поток с новым токеном...")
                return next(addToken(req, res.access_token))
            })
        )
    }

    return next(addToken(req, authService.token!))
}

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
}