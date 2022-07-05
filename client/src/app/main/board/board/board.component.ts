import { AuthService } from "src/app/core/services/auth.service";
import { User } from "src/app/core/models/user";
import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
})
export class BoardComponent implements OnInit {
  public fileUrl: string = environment.fileUrl;
  currentUser: User;

  constructor(
    public messageService: MessageService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.fileUrl = this.fileUrl + this.currentUser.picture;
    console.log(this.fileUrl);
  }

  logout() {
    this.authService.logout();
  }
}
