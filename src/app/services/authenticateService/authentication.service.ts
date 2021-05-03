import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Compte } from '../../models/compte/compte';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<Compte>;
    public currentUser: Observable<Compte>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Compte>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Compte {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`http://localhost:8080/api/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }
    getLogCompte():Observable<Compte>{
        return this.http.get<Compte>(`http://localhost:8080/api/logUser`);
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}