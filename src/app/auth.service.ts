import { AppUser } from './models/app-user';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';


@Injectable()
export class AuthService {

  user$: Observable<firebase.User>

  constructor(private afAuth: AngularFireAuth, private route: ActivatedRoute, private userService: UserService ) {
      this.user$ = afAuth.authState;
    }

  login() {
    //We are doing this for redirection to the page that the user came from to access the login page. We can use snapshot because the route is basically constant and we don't have any previous or next buttons. We are saving the returnUrl to local storage because once we redirect to google auth our info aboyt returnUrl gets lost.
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    //Redirection to Google OAuth to login.
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout(){
    this.afAuth.auth.signOut();
  }

  get appUser$():Observable<AppUser> {
    return this.user$
    .switchMap(user => {
      if (user) this.userService.get(user.uid);

      return Observable.of(null)
    });
  }
}
