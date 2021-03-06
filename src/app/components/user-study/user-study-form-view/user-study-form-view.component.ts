import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {UserStudyUserService} from '../../../service/user-study/user-study-user.service';

@Component({
  selector: 'app-user-study-form-view',
  templateUrl: './user-study-form-view.component.html',
  styleUrls: ['./user-study-form-view.component.css']
})
export class UserStudyFormViewComponent implements OnInit {

  @Input() data;
  url: string;
  verificationCode: string;
  @Output() next = new EventEmitter<void>();

  userInputCode = '';
  prolificID: string;

  constructor(
    private domSanitizer: DomSanitizer,
    private userStudyUserService: UserStudyUserService,
  ) { }

  ngOnInit(): void {
    const parts = this.data.split(' ');
    this.url = parts[0];
    this.verificationCode = parts[1];

    this.prolificID = this.userStudyUserService.getLoggedInUser().prolificId;
  }

  nextStep() {
    this.next.emit();
  }

  makeTrustedURL(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url + '?embedded=true');
  }

}
