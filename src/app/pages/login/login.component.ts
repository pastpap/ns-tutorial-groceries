import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";

@Component({
  selector: "gr-main",
  providers: [UserService],
  templateUrl: "login.component.html",
  styleUrls: ["login-common.css", "login.css"]
})
export class LoginComponent {
  public user: User;
  public isLoggingIn = true;

  constructor(private router: Router, private userService: UserService) {
    this.user = new User();
    this.user.email = "sp@me.com";
    this.user.password = "admin123";
  }
  public submit() {
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }
  signUp() {
    this.userService.register(this.user).subscribe(
      () => {
        alert("Your account was successfully created.");
        this.toggleDisplay();
      },
      () => alert("Unfortunately we were unable to create your account.")
    );
  }
  private login() {
    this.userService
      .login(this.user)
      .subscribe(
        () => this.router.navigate(["/list"]),
        error => alert("Unfortunately we could not find your account.")
      );
  }
  public toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
}
