import { Component, OnInit } from '@angular/core';
import { OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'OpenID Connect 認証デモ';
  userData$: Observable<UserDataResult>;
  configuration: OpenIdConfiguration;
  isAuthenticated = false;
  
  constructor(public oidcSecurityService: OidcSecurityService) {
    this.configuration = this.oidcSecurityService.getConfiguration();
    this.userData$ = this.oidcSecurityService.userData$;
  }

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData}) => {
      if (isAuthenticated){
        this.isAuthenticated = true
      } else {
        this.isAuthenticated = false
      }
      this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken, idToken, configId }) => {
          console.log("x isAuthenticated = ", isAuthenticated);
          console.log("x accessToken = ", accessToken);
          console.log("x idToken = ", idToken);      
      });
    });
  }


  login() {
    this.oidcSecurityService.authorize();

    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken, idToken, configId }) => {
      console.log("isAuthenticated = ", isAuthenticated);
      console.log("accessToken = ", accessToken);
      console.log("idToken = ", idToken);      
    });    
  }

  logout() {
    this.oidcSecurityService.logoff();
    document.location.reload();
  }

}
