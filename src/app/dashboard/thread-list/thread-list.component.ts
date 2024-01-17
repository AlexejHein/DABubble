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

    //const aCollection = collection(this.firestore, 'threads')
    //this.items$ = collectionData(aCollection, { idField: 'id' });
    this.items$ = this.firestore.collection('threads').valueChanges({ idField: 'id' });

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
  getReactionCounts(reactions: Reaction[]): any {
    const counts: {[key: string]: number} = {};
    reactions.forEach(reaction => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
    return counts;
  }
}
