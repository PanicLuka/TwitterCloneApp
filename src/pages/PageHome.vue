<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute fullscreen">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            class="new-tweet"
            autogrow
            bottom-slots
            v-model="newTweetContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
          >
            <!-- placeholder is same thing as label, except when you click on placeholder the text disappears -->
            <template v-slot:before>
              <q-avatar size="lg">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addATweet"
            class="q-mb-lg"
            :disable="!newTweetContent"
            no-caps
            unelevated
            rounded
            color="primary"
            label="Tweet"
          />
        </div>
      </div>
      <q-separator class="speparator-tweet" size="10px" color="grey-2" />
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="tweet in tweets" :key="tweet.date" class="q-py-md">
            <q-item-section avatar top>
              <q-avatar size="lg">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong> Panic Luka </strong>
                <span class="hashtag">
                  @panic_luka
                  <br class="lt-md" />
                  &bull;
                  {{ formatDate(tweet.date) }} ago
                </span>
              </q-item-label>
              <q-item-label class="tweet-content text-body1">
                {{ tweet.content }}
              </q-item-label>
              <div class="tweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn flat round color="grey" size="sm" icon="far fa-heart" />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                  @click="deleteATweet(tweet)"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
} from "firebase/firestore";

export default defineComponent({
  name: "PageHome",
  data() {
    return {
      newTweetContent: "",
      tweets: [
        // {
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis non  delectus minima alias possimus, similique pariatur recusandae tenetur exercitationem maxime mollitia velit ipsum quia sequi ",
        //   date: 1652692024489,
        // },
        // {
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis non  delectus minima alias possimus, similique pariatur recusandae tenetur exercitationem maxime mollitia velit ipsum quia sequi ",
        //   date: 1652692024483,
        // },
      ],
    };
  },
  methods: {
    deleteATweet(tweet) {
      let dateToDelete = tweet.date;
      let index = this.tweets.findIndex((tweet) => tweet.date === dateToDelete);
      this.tweets.splice(index, 1);
    },
    addATweet() {
      let newTweet = {
        content: this.newTweetContent,
        date: Date.now(),
      };

      // this.tweets.unshift(newTweet);
      addDoc(collection(db, "tweets"), newTweet);

      this.newTweetContent = "";
    },
    formatDate(date) {
      return formatDistance(date, new Date());
    },
  },
  mounted() {
    const q = query(collection(db, "tweets"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let tweetChange = change.doc.data();
        if (change.type === "added") {
          // console.log("New tweet: ", tweetChange);
          this.tweets.unshift(tweetChange);
        }
        if (change.type === "modified") {
          console.log("Modified tweet: ", tweetChange);
        }
        if (change.type === "removed") {
          console.log("Removed tweet: ", tweetChange);
        }
      });
    });
  },
});
</script>


<style scoped>
.hashtag {
  color: grey;
}

.tweet-icons {
  margin-left: -5px;
}
.tweet-content {
  white-space: pre-line;
}

.new-tweet {
  font-size: 19px;
  line-height: 1.4;
}
.speparator-tweet {
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: rgba(218, 206, 206, 0.336);
}
</style>
