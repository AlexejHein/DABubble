import {Component, OnInit, inject, signal, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { ThreadsService } from 'src/app/services/threads.service';
import { UserService } from '../../services/user.service';
import { User} from "../../models/User.class";
import {Reaction} from "../../models/reaction.class";

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit {

  firestore: Firestore = inject(Firestore)
  items$!: Observable<any[]>;
  private subscription: Subscription | null = null;
  allThreads: any[] = [];
  allThreadsFiltered: any[] = [];
  thread = new Thread();
  threadId: any;
  selectedChannel: any;
  selectedChannelId: any;
  currentUser: User | null | undefined;
  currentUserId: string | null = "";
  currentUserAvatar: string | undefined = "";
  user: string | undefined | null = "";
  allUsers: User[] = [];
  protected hoveredIndex: number | undefined;
  hideThreadMenu = signal<any | null>(null);
  private chosen: string | undefined;
  private showReactions: boolean | undefined;

  constructor(  private userService: UserService,
                protected threadsService: ThreadsService,
                private changeDetector: ChangeDetectorRef) {}

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

    const aCollection = collection(this.firestore, 'threads')
    this.items$ = collectionData(aCollection, { idField: 'id' });
    this.items$.subscribe((threads) => {
      this.allThreads = threads;
      console.log(threads);

      //could fix the bug
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

  showThreadMenu(i: number) {
    this.hoveredIndex=i;
    this.changeDetector.detectChanges();
  }

  selectEmoForThread(emoticon: string, threadId: string) {
    this.showReactions = true;
    this.chosen = emoticon;
    const newReaction: Reaction = {
      emoji: emoticon,
      userId: this.currentUserId ?? ''
    };

    const threadToUpdate = this.allThreadsFiltered.find(thread => thread.id === threadId);
    if (threadToUpdate) {
      if (!threadToUpdate.reactions) {
        threadToUpdate.reactions = [newReaction];
      } else {
        let existingReaction = threadToUpdate.reactions.find((reaction: { userId: string | null; }) => reaction.userId === this.currentUserId);
        if (existingReaction) {
          existingReaction.emoji = emoticon; // Update existing reaction
        } else {
          threadToUpdate.reactions.push(newReaction); // Add new reaction
        }
      }
      this.saveUpdatedThread(threadToUpdate);
    } else {
      console.error("Thread nicht gefunden");
    }
  }


  saveUpdatedThread(threadToUpdate: any) {

  }
}
