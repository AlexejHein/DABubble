import {Component, OnInit, inject, signal, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { ThreadsService } from 'src/app/services/threads.service';
import { UserService } from '../../services/user.service';
import { User} from "../../models/User.class";
import {Reaction} from "../../models/reaction.class";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { DashboardComponent } from "../dashboard.component";
import { WorkspaceService } from 'src/app/services/workspace.service';


@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit {

  //firestore: Firestore = inject(Firestore)
  items$!: Observable<any[]>;
  private subscription: Subscription | null = null;
  allThreads: any[] = [];
  allThreadsFiltered: any[] = [];
  thread = new Thread();
  threadId: any;
  selectedThread: any;
  selectedChannel: any;
  selectedChannelId: any;
  selectedThreadId: any;
  currentUser: User | null | undefined;
  currentUserId: string | null = "";
  currentUserAvatar: string | undefined = "";
  user: string | undefined | null = "";
  allUsers: User[] = [];
  threadVisible = true;
  moveRight:string = "";
  moveLeft:string = "";
  selectedUser:  User | null = null;
  protected hoveredIndex: number | undefined;
  hideThreadMenu = signal<any | null>(null);
  private chosen: string | undefined;
  private showReactions: boolean | undefined;
  private threadsRef: any;
  readonly breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
    .pipe(
      tap(value => {}),
      distinctUntilChanged()
    );

    Breakpoints = Breakpoints;
    currentBreakpoint:string = '';

  constructor(  private userService: UserService,
                protected threadsService: ThreadsService,
                private changeDetector: ChangeDetectorRef,
                private firestore: AngularFirestore,
                private breakpointObserver: BreakpointObserver,
                private dashboard: DashboardComponent,
                private workspaceService: WorkspaceService,) {
  this.threadsRef = this.firestore.collection('threads').ref;
  }

  ngOnInit(): void {
    this.breakpoint$.subscribe(() =>
    this.breakpointChanged()
  );
    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
    });

    this.userService.getUsers().subscribe(users => {
      this.currentUser = users.find(user => user.id === this.thread.authorId);
      if (this.currentUser) {
        this.user = this.currentUser.name;
        this.currentUserAvatar = this.currentUser.avatar;
      }
    });
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
    }).catch(error => {
      console.error("Error getting current user ID:", error);
    });

    this.items$ = this.firestore.collection('threads', ref => ref.orderBy('createdAt', 'asc')).valueChanges({ idField: 'id' });


    this.items$.subscribe((threads) => {
      this.allThreads = threads;
      this.subscription = this.threadsService.selectedChannel.subscribe(channel => {
        this.selectedChannel = channel;
        this.selectedChannelId = channel?.id;
        this.allThreadsFiltered = this.allThreads.filter((f) =>
        this.selectedChannelId === f.toChannel);

        this.allThreadsFiltered.forEach((item)=>{
          if (item.title.includes('@')){
            item.tag=this.getTag(item.title)
          }
          
        })
      });
      });
      
  }

  extractName(str: string): string | null {
    const parts = str.split('@');
    return parts.length > 1 ? parts[1].trim() : null;
  }

  handleClickUser(msgBody:any) {
    const username = this.extractName(msgBody);
    const userFind = this.allUsers.find(u => u.name === username);

    this.chatWithSelectedUser(userFind);
  }
  setSelectedUser(user: any) {
    this.selectedUser=user
    this.changeDetector.detectChanges();
  }

  chatWithSelectedUser(selectedUser: any): void {
    this.userService.setSelectedUser(selectedUser);
    this.workspaceService.addMessageClicked();
  }

  getTag(msg:any){
    let splitMsg:any= [];
    let nameArray=this.allUsers.map((item)=>{
      return `@${item.name}`;
    })
    let regex = new RegExp(`(${nameArray.join('|')})`);
    let parts = msg.split(regex);

    parts.forEach((part:any) => {
        if (part.trim() !== "") {
            splitMsg.push(part.trim());
        }
    });
    
    return splitMsg
  }

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.currentBreakpoint = Breakpoints.Large;
    } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.currentBreakpoint = Breakpoints.Medium;
    } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.currentBreakpoint = Breakpoints.Small;
    } else if(this.breakpointObserver.isMatched('(min-width: 500px)')) {
      this.currentBreakpoint = '(min-width: 500px)';
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  showThreadMenu(i: number) {
    this.hoveredIndex=i;
    this.changeDetector.detectChanges();
  }

  selectEmoForThread(emoticon: string, threadId: string) {
    this.showReactions = true;
    this.chosen = emoticon;
    const newReaction: Reaction = {
      emoji: emoticon,
      userId: this.currentUserId ?? '',
    };
    const threadToUpdate = this.allThreadsFiltered.find(thread => thread.id === threadId);
    if (threadToUpdate) {
      if (!threadToUpdate.reactions) {
        threadToUpdate.reactions = [newReaction];
      } else {
        const existingReactionIndex = threadToUpdate.reactions.findIndex(
            (reaction: { userId: string | null; emoji: string; }) => reaction.userId === this.currentUserId && reaction.emoji === emoticon
        );
        if (existingReactionIndex !== -1) {
          threadToUpdate.reactions.splice(existingReactionIndex, 1);
        } else {
          threadToUpdate.reactions.push(newReaction);
        }
      }
      this.saveUpdatedThread(threadToUpdate);
    } else {
      console.error("Thread nicht gefunden");
    }
  }


  saveUpdatedThread(threadToUpdate: any) {
    const threadRef = this.threadsRef.doc(threadToUpdate.id);
    threadRef.update({
      reactions: threadToUpdate.reactions
    }).then(() => {
    }).catch((error: any) => {
      console.error("Fehler beim Aktualisieren des Threads: ", error);
    });
  }
  getReactionCounts(thread: Thread ):{ emoji: string, count: number, userId?: string }[] {
    const summary = new Map<string, { count: number, userId?: string }>();
    thread.reactions.forEach(reactions => {
      const existingReaction = summary.get(reactions.emoji);
      if (existingReaction) {
        existingReaction.count += 1;
      } else {
        summary.set(reactions.emoji, { count: 1, userId: reactions.userId });
      }
    });

    return Array.from(summary, ([emoji, { count, userId }]) => ({ emoji, count, userId }));
  }

  isImage(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const isImage = imageExtensions.some(ext => url.toLowerCase().includes(ext));

    return isImage;
  }

  isPDF(url: string): boolean {
    const isPDF = url.toLowerCase().includes('.pdf');

    return isPDF;
  }


  getPDFFileName(url: string): string {
    const decodedUrl = decodeURIComponent(url);
    const urlParts = decodedUrl.split('/');
    return urlParts[urlParts.length - 1].split('?')[0];
  }

  getUserName(userId: unknown): string {
    const user = this.allUsers.find(user => user.id === userId);
    return user ? user.name : '';
  }

  loadSelectedThreadInfos(selectedThread: Thread): void {
    this.threadsService.setSelectedThread(selectedThread);
    this.dashboard.isInputVisible = false;
    this.dashboard.toggleVisibility();
  }

  showThread(){
    this.threadVisible = true;
    this.threadsService.setSelectedSidebarVisibility(this.threadVisible);

  }

  moveSidebar(){
    this.moveRight = "";
    this.threadsService.setselectedSidebarClassName(this.moveRight);
    this.dashboard.closeWorkspaceMenu();
    if(this.currentBreakpoint == Breakpoints.Medium){
      this.moveLeft = "moveleft";
      this.threadsService.setselectedLeftSidebarClassName(this.moveLeft);
    }
  }

  

}
