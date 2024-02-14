import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserMenuComponent } from './user-menu/user-menu.component';
import  { UserService } from '../../services/user.service';
import { AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit{

  isMobileMenuVisible = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isMobileMenuVisible) {
      this.toggleMobileMenu(); // Diese Funktion setzt isMobileMenuVisible auf false, um das Menü zu schließen
    }
  }

  currentUserId: string | null | undefined;
  currentUserDetails: any;


  constructor(private elRef: ElementRef, public dialog: MatDialog, private userService: UserService, private authService: AuthService
) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
      if(this.currentUserId) {
        this.userService.getUserDetails(this.currentUserId).subscribe(userDetails => {
          this.currentUserDetails = userDetails;
        });
      }
    }).catch(error => {
      console.error("Error getting current user ID:", error);
    });
  }

  logoutUser(){
    if (this.userService.currentUser){
      this.authService.logout().then(r => {});
    }else {
      console.log('No user is logged in');
    }
  }

  openDialog(){
    let dialogWidth = '500px';
    let dialogHeight = '600px';
    let dialogTop = '10%';
    let dialogRight = '10%';
    if (window.innerWidth <= 768) {
      dialogWidth = '100%';
      dialogHeight = '100%';
      dialogTop = '0';
      dialogRight = '0';
    }
    this.dialog.open(UserMenuComponent, {
      height: dialogHeight,
      width: dialogWidth,
      position:{
        top: dialogTop,
        right: dialogRight
      }
    });
  }

  checkScreenSize() {
    this.isMobileMenuVisible = window.innerWidth <= 768 && false;
  }
  toggleMobileMenu() {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }

}
