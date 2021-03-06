import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthenticationService} from 'src/app/service/authentication/authentication.service';
import {User} from 'src/app/interface/user';
import {MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  registerForm = new FormGroup({
    name: new FormControl(),
    password: new FormControl()
  });

  constructor(
    private responsiveService: ResponsiveService,
    private userService: AuthenticationService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      this.isMobile = isMobile;
    });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  onLogin(): void {
    const newUser: User = {
      name: this.registerForm.controls.name.value,
      password: this.registerForm.controls.password.value
    };
    // console.log(newUser);

    this.userService.login(newUser).then(
      async () => {
        // console.log('Login successful.');
        this.dialogRef.close(true);
        await this.router.navigate(['/overview'], { relativeTo: this.route });
      },
      async () => {
        // console.log('Login failed.');
        this.dialogRef.close(false);
      }
    );
  }

  onBack(): void {
    this.dialogRef.close(false);
  }
}
