import {Component, OnInit, inject, signal, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { ThreadsService } from 'src/app/services/threads.service';
import { UserService } from '../../services/user.service';
import { User} from "../../models/User.class";
import {Reaction} from "../../models/reaction.class";
import {AngularFirestore} from "@angular/fire/compat/firestore";



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
  protected hoveredIndex: number | undefined;
  hideThreadMenu = signal<any | null>(null);
  private chosen: string | undefined;
  private showReactions: boolean | undefined;
  private threadsRef: any;

  constructor(  private userService: UserService,
                protected threadsService: ThreadsService,
                private changeDetector: ChangeDetectorRef,
                private firestore: AngularFirestore,) {
    this.threadsRef = this.firestore.collection('threads').ref;
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
      console.log("All Users in thread:", this.allUsers);
    });

    this.userService.getUsers().subscribe(users => {
      this.currentUser = users.find(user => user.id === this.thread.authorId);
      if (this.currentUser) {
        console.log("thread current user:", this.currentUser);
        this.user = this.currentUser.name;
        this.currentUserAvatar = this.currentUser.avatar;
      }
    });
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
      console.log("Current User ID:", this.currentUserId);
    }).catch(error => {
      console.error("Error getting current user ID:", error);
    });

    this.items$ = this.firestore.collection('threads').valueChanges({ idField: 'id' });

    this.items$.subscribe((threads) => {
      this.allThreads = threads;
      console.log(threads);

      this.subscription = this.threadsService.selectedChannel.subscribe(channel => {
        this.selectedChannel = channel;
        this.selectedChannelId = channel?.id;
        console.log('neu selected channel id: ', this.selectedChannelId);
        console.log('all threads: ', this.allThreads);
        this.allThreadsFiltered = this.allThreads.filter((f) =>
        this.selectedChannelId === f.toChannel)
      });
      });



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
        let existingReaction = threadToUpdate.reactions.find((reaction: { userId: string | null; }) => reaction.userId === this.currentUserId);
        if (existingReaction) {
          existingReaction.emoji = emoticon;
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
      console.log("Thread erfolgreich aktualisiert");
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
  }

  showThread(){
    this.threadVisible = true;
    this.threadsService.setSelectedSidebarVisibility(this.threadVisible);
  }

  moveSidebar(){
    this.moveRight = "";
    this.threadsService.setselectedSidebarClassName(this.moveRight);
  }

}
