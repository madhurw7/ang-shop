import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthGuard implements CanActivate{
//The CanActivate needs a function named canActivate which either returns true or false
  
//In order to get our authentication state we need to inject our AuthService in our constructor
  constructor(private auth: AuthService, private router: Router) { }

  //canActivate can take 2 arguments, the second one is used for the optional query parameter that can allow us to redirect to the page we came from after logging in
  canActivate(route, state: RouterStateSnapshot){
    //This is for protecting the routes checks if user is logged in or not
    //We don't necessarily  have to return bool we can instead return a prommise of a bool, that is why we used map, to map promise of a boolean and return that
    return this.auth.user$.map(user => {
      if (user) return true;

      //if user is not logged in, then we need to redirect the page to the sign in page. For that we need to inject the router service into this class
      //The queryParams is used to give additional parameters that would be added to the url being redirected to. It is set to an object which contains a property returnUrl self explanatory
      //But what happens is we are using Google Oauth to login, ie we are redirected there and in that this info is lost. We need to save this info to the local storage to prevent this. We implement this in the auth service.
        this.router.navigate(['/login'], { queryParams: {returnUrl: state.url }});
        return false;
    });
  }
}
