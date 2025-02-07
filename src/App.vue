<template>
  <div class="min-h-screen bg-amber-50 text-gray-900">
    <!-- HEADER: Date, Search, Navigation -->
    <header class="w-full py-12 bg-amber-100 shadow-md relative">
      <div class="w-full px-8 flex justify-between items-center">
        <div>
          <h1 class="text-6xl font-extrabold tracking-wide text-left">
            10K PROJECTS ADDS FOR
            <!-- Date wrapped in a relative inline container -->
            <span class="ml-4 relative inline-block">
              <span
                class="cursor-pointer border-b-2 border-dashed border-black"
                @click="toggleDateDropdown"
              >
                {{ nextMeetingDisplay }}
              </span>
              <div
                v-if="dropdownOpen"
                class="absolute left-0 top-full mt-1 bg-amber-100 border border-gray-300 rounded shadow-md z-20"
              >
                <ul>
                  <!-- Only one option: the computed next meeting date -->
                  <li
                    @click="selectDate(nextMeetingDateRaw)"
                    class="px-6 py-3 hover:bg-amber-200 cursor-pointer text-2xl font-extrabold"
                  >
                    {{ nextMeetingDisplay }}
                  </li>
                </ul>
              </div>
            </span>
          </h1>
        </div>
        <!-- Search Box -->
        <div>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search..."
            class="px-4 py-2 border rounded"
          />
        </div>
      </div>
      <!-- Navigation Buttons -->
      <div class="w-full px-8 mt-4 flex justify-end space-x-4">
        <button
          @click="goToPage('form')"
          :class="currentPage==='form' ? 'bg-gray-900 text-amber-50' : 'bg-gray-200 text-gray-900'"
          class="px-4 py-2 rounded"
        >
          Home
        </button>
        <button
          @click="goToPage('leaderboard')"
          :class="currentPage==='leaderboard' ? 'bg-gray-900 text-amber-50' : 'bg-gray-200 text-gray-900'"
          class="px-4 py-2 rounded"
        >
          Leaderboard
        </button>
        <button
          @click="goToPage('additions')"
          :class="currentPage==='additions' ? 'bg-gray-900 text-amber-50' : 'bg-gray-200 text-gray-900'"
          class="px-4 py-2 rounded"
        >
          Additions
        </button>
      </div>
    </header>

    <!-- SEARCH RESULTS -->
    <div v-if="searchTerm.trim() !== ''" class="w-full px-8 mb-8">
      <h2 class="text-3xl font-bold mb-4">Search Results</h2>
      <ul>
        <li
          v-for="(result, index) in searchResults"
          :key="index"
          class="border-b border-gray-300 py-2"
        >
          <div class="flex justify-between">
            <span class="font-bold">{{ result.name }}</span>
            <span>{{ formatDate(result.timestamp) }}</span>
          </div>
          <div class="text-sm whitespace-pre-wrap">
            {{ result.newAdditions }}
            {{ result.dealsToGoOut }}
            {{ result.outreachUpdates }}
            {{ result.dealsOutWithUpdates }}
          </div>
        </li>
      </ul>
    </div>

    <!-- MAIN CONTENT -->
    <main class="w-full px-8 py-16 space-y-12">
      <!-- FORM PAGE (current meeting) -->
      <div v-if="currentPage==='form'">
        <div v-if="isMeetingArchived" class="text-center text-red-700 font-bold mb-4">
          This meeting is archived. Submissions are no longer editable.
        </div>
        <!-- Name Dropdown with extra bottom margin -->
        <div class="relative flex justify-center mb-8" ref="nameDropdownWrapper">
          <div
            class="cursor-pointer text-3xl font-bold border-b-2 border-dashed border-black flex items-center"
            @click="toggleNameDropdown"
          >
            <span
              v-if="selectedName"
              class="inline-block w-3 h-3 rounded-full mr-2"
              :style="{ backgroundColor: selectedName.color }"
            ></span>
            <span v-if="selectedName">{{ selectedName.name }}</span>
            <span v-else>Select Your Name</span>
          </div>
          <div
            v-if="nameDropdownOpen"
            class="absolute mt-3 bg-amber-50 border border-gray-300 rounded shadow-md z-10"
          >
            <ul>
              <li
                v-for="(user, index) in names"
                :key="index"
                @click="selectName(user)"
                class="px-6 py-3 hover:bg-amber-200 cursor-pointer text-3xl font-bold flex items-center"
                :class="{ 'line-through opacity-50': user.submitted }"
              >
                <span
                  class="inline-block w-3 h-3 rounded-full mr-2"
                  :style="{ backgroundColor: user.color }"
                ></span>
                {{ user.name }}
              </li>
            </ul>
          </div>
        </div>
        <!-- Submission Fields -->
        <div v-if="selectedName" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-2xl font-bold mb-2">New Additions:</label>
            <textarea
              v-model="newAdditions"
              :disabled="isMeetingArchived"
              placeholder="Enter new additions (e.g., Destruction of the cult of the sun: This is a cool band!)"
              class="w-full bg-amber-50 border border-gray-400 rounded px-4 py-3 text-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none whitespace-pre-wrap"
              rows="6"
            ></textarea>
          </div>
          <div>
            <label class="block text-2xl font-bold mb-2">Deals To Go Out:</label>
            <textarea
              v-model="dealsToGoOut"
              :disabled="isMeetingArchived"
              placeholder="Enter deals to go out..."
              class="w-full bg-amber-50 border border-gray-400 rounded px-4 py-3 text-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none whitespace-pre-wrap"
              rows="6"
            ></textarea>
          </div>
          <div>
            <label class="block text-2xl font-bold mb-2">Outreach Updates:</label>
            <textarea
              v-model="outreachUpdates"
              :disabled="isMeetingArchived"
              placeholder="Enter outreach updates..."
              class="w-full bg-amber-50 border border-gray-400 rounded px-4 py-3 text-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none whitespace-pre-wrap"
              rows="6"
            ></textarea>
          </div>
          <div>
            <label class="block text-2xl font-bold mb-2">Deals Out With Updates:</label>
            <textarea
              v-model="dealsOutWithUpdates"
              :disabled="isMeetingArchived"
              placeholder="Enter deals out with updates..."
              class="w-full bg-amber-50 border border-gray-400 rounded px-4 py-3 text-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none whitespace-pre-wrap"
              rows="6"
            ></textarea>
          </div>
        </div>
        <!-- Submit Button -->
        <div v-if="selectedName && !isMeetingArchived" class="flex justify-center mt-8">
          <button
            type="button"
            @click="handleSubmit"
            class="bg-gray-900 hover:bg-gray-800 transition duration-300 text-amber-50 font-bold py-5 px-12 rounded uppercase tracking-wider"
          >
            Submit
          </button>
        </div>
      </div>

      <!-- LEADERBOARD PAGE (current meeting) -->
      <div v-if="currentPage==='leaderboard'">
        <div class="flex justify-center space-x-4 mb-8">
          <button
            @click="leaderboardTab = 'most'"
            :class="leaderboardTab==='most' ? 'bg-gray-900 text-amber-50' : 'bg-gray-200 text-gray-900'"
            class="px-6 py-3 rounded uppercase font-bold transition"
          >
            This Meeting's Most Adds
          </button>
          <button
            @click="leaderboardTab = 'fastest'"
            :class="leaderboardTab==='fastest' ? 'bg-gray-900 text-amber-50' : 'bg-gray-200 text-gray-900'"
            class="px-6 py-3 rounded uppercase font-bold transition"
          >
            This Meeting's Fastest Adds
          </button>
        </div>
        <div>
          <ul>
            <li
              v-for="(entry, index) in currentLeaderboard"
              :key="index"
              class="flex items-center justify-between border-b border-gray-300 py-4 text-2xl"
            >
              <div class="flex items-center">
                <span class="inline-block w-4 h-4 rounded-full mr-4" :style="{ backgroundColor: entry.color }"></span>
                <span>{{ entry.name }}</span>
              </div>
              <div>
                <span v-if="leaderboardTab==='most'">{{ entry.count }} Adds</span>
                <span v-else>{{ entry.formattedTime }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="flex justify-center mt-8">
          <button
            @click="handleGenerateAgenda"
            class="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-bold py-3 px-8 rounded"
          >
            GENERATE AGENDA
          </button>
        </div>
      </div>

      <!-- ADDITIONS PAGE -->
      <div v-if="currentPage==='additions'">
        <!-- If in production, show a simple "Work in Progress" message -->
        <div v-if="isProduction" class="flex flex-col items-center justify-center py-16">
          <h2 class="text-4xl font-bold mb-4">Additions</h2>
          <p class="text-2xl text-gray-700">Work In Progress</p>
        </div>
        <!-- Otherwise, show the full Additions interface for development -->
        <div v-else>
          <h2 class="text-4xl font-bold text-left mb-8">Additions</h2>
          <div class="flex flex-wrap justify-start gap-4">
            <div
              v-for="(contributions, artist) in allParsedAdditions"
              :key="artist"
              class="w-full sm:w-1/2 md:w-1/3 p-4 border rounded shadow-sm bg-white mb-6"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <span class="w-4 h-4 rounded-full mr-2" :style="{ backgroundColor: getArtistColor(artist) }"></span>
                  <span class="font-bold text-xl">{{ artist }}</span>
                  <span class="ml-2 text-sm text-gray-600">
                    [Added on {{ getEarliestAdditionDate(contributions) }}]
                  </span>
                </div>
                <!-- Status Dropdown -->
                <div>
                  <select
                    v-model="artistStatuses[artist]"
                    class="bg-transparent border-b-2 border-dashed border-black appearance-none px-2 py-1 text-sm"
                  >
                    <option :value="'Added on ' + getEarliestAdditionDate(contributions)">
                      Added on {{ getEarliestAdditionDate(contributions) }}
                    </option>
                    <option :value="'Reached out on ' + getToday()">
                      Reached out on {{ getToday() }}
                    </option>
                    <option :value="'Deal out on ' + getToday()">
                      Deal out on {{ getToday() }}
                    </option>
                  </select>
                </div>
              </div>
              <!-- Comment Input -->
              <div class="mb-2">
                <textarea
                  v-model="artistComments[artist]"
                  placeholder="Leave your update..."
                  class="w-full border border-gray-400 rounded px-2 py-1 text-sm whitespace-pre-wrap"
                  rows="2"
                ></textarea>
              </div>
              <div class="flex justify-end mb-2">
                <button
                  @click="postArtistUpdate(artist)"
                  class="bg-green-600 text-amber-50 px-3 py-1 rounded text-sm"
                >
                  Post Update
                </button>
              </div>
              <!-- Display Status Updates -->
              <div v-if="artistAdditions[artist] && artistAdditions[artist].length" class="mt-4">
                <h4 class="font-bold text-lg mb-2">Status Updates:</h4>
                <div class="space-y-1">
                  <div
                    v-for="(update, idx) in artistAdditions[artist]"
                    :key="idx"
                    class="p-2 bg-gray-100 rounded"
                  >
                    <div class="font-semibold">{{ update.status }}</div>
                    <div class="text-sm">{{ update.comment }}</div>
                    <div class="text-xs text-gray-500">{{ update.date }} - {{ update.contributor }}</div>
                  </div>
                </div>
              </div>
              <!-- Display Parsed Contributions -->
              <div class="mt-4">
                <h4 class="font-bold text-lg mb-2">Parsed Contributions:</h4>
                <div class="space-y-2">
                  <div
                    v-for="(item, index) in contributions"
                    :key="index"
                    class="p-2 bg-gray-50 rounded border"
                  >
                    <div>{{ item.comment }}</div>
                    <div class="text-sm text-gray-500">
                      – from {{ item.contributor }}, {{ formatDate(item.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  arrayUnion
} from "firebase/firestore";

export default {
  name: "MinimalForm",
  data() {
    return {
      selectedDate: "",
      dropdownOpen: false,
      names: [
        { name: "Arya", color: "#EF4444", submitted: false },
        { name: "Chris", color: "#F59E0B", submitted: false },
        { name: "Charlie", color: "#10B981", submitted: false },
        { name: "Christian", color: "#3B82F6", submitted: false },
        { name: "Benicio", color: "#8B5CF6", submitted: false },
        { name: "Sam", color: "#EC4899", submitted: false },
        { name: "Akiva", color: "#F472B6", submitted: false },
        { name: "Lucas", color: "#06B6D4", submitted: false }
      ],
      selectedName: null,
      nameDropdownOpen: false,
      newAdditions: "",
      dealsToGoOut: "",
      outreachUpdates: "",
      dealsOutWithUpdates: "",
      currentPage: "form",
      leaderboardTab: "most",
      leaderboardFastestAdds: [],
      weeklySubmissions: [],
      allSubmissions: [],
      artistAdditions: {},
      artistStatuses: {},
      artistComments: {},
      showAgenda: false,
      searchTerm: ""
    };
  },
  computed: {
    // Helper to format a Date object into a local string "YYYY/MM/DD"
    formatLocalDate() {
      return (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}/${month}/${day}`;
      };
    },
    // Compute the next meeting date as a raw string "YYYY/MM/DD"
    // Rules:
    // - If today is Tuesday (2) or Friday (5), return today's date.
    // - Otherwise, compute the offsets to next Tuesday and Friday and choose the smaller.
    nextMeetingDateRaw() {
      const today = new Date();
      const day = today.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
      if (day === 2 || day === 5) {
        return this.formatLocalDate(today);
      }
      const offsetTuesday = ((2 - day + 7) % 7) || 7;
      const offsetFriday = ((5 - day + 7) % 7) || 7;
      const meetingOffset = Math.min(offsetTuesday, offsetFriday);
      const meetingDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + meetingOffset);
      return this.formatLocalDate(meetingDate);
    },
    // Compute the display string for the next meeting.
    // If the computed raw date equals today's local date, display "Today"; otherwise, display the formatted date.
    nextMeetingDisplay() {
      const todayStr = this.formatLocalDate(new Date());
      if (this.nextMeetingDateRaw === todayStr) {
        return "Today";
      } else {
        const parts = this.nextMeetingDateRaw.split("/");
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "2-digit",
          day: "2-digit"
        });
      }
    },
    searchResults() {
      const term = this.searchTerm.toLowerCase();
      return this.weeklySubmissions.filter((sub) => {
        return (
          sub.name.toLowerCase().includes(term) ||
          (sub.newAdditions && sub.newAdditions.toLowerCase().includes(term)) ||
          (sub.dealsToGoOut && sub.dealsToGoOut.toLowerCase().includes(term)) ||
          (sub.outreachUpdates && sub.outreachUpdates.toLowerCase().includes(term)) ||
          (sub.dealsOutWithUpdates && sub.dealsOutWithUpdates.toLowerCase().includes(term))
        );
      });
    },
    parsedLeaderboard() {
      const counts = {};
      this.weeklySubmissions.forEach((sub) => {
        if (sub.newAdditions) {
          const lines = sub.newAdditions.split(/\r?\n/).filter(line => line.trim() !== "");
          let parsedCount = 0;
          lines.forEach(line => {
            if (line.trim().match(/^(.+?):\s*(.+)$/)) {
              parsedCount++;
            }
          });
          if (sub.name) {
            counts[sub.name] = (counts[sub.name] || 0) + parsedCount;
          }
        }
      });
      return Object.keys(counts).map(name => {
        const user = this.names.find(u => u.name === name);
        return {
          name,
          count: counts[name],
          color: user ? user.color : "#000000"
        };
      }).sort((a, b) => b.count - a.count);
    },
    groupedAgendaNewAdditions() {
      const groups = {};
      this.weeklySubmissions.forEach((sub) => {
        if (sub.newAdditions && sub.newAdditions.trim() !== "") {
          if (!groups[sub.name]) groups[sub.name] = [];
          groups[sub.name].push(sub.newAdditions);
        }
      });
      return groups;
    },
    allParsedAdditions() {
      const groups = {};
      this.allSubmissions.forEach((sub) => {
        if (sub.newAdditions) {
          const lines = sub.newAdditions.split(/\r?\n/);
          lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return;
            const match = trimmed.match(/^(.+?):\s*(.+)$/);
            if (match) {
              const artist = match[1].trim();
              const comment = match[2];
              if (!groups[artist]) groups[artist] = [];
              groups[artist].push({
                comment,
                contributor: sub.name,
                timestamp: sub.timestamp,
                submissionId: sub.id
              });
            }
          });
        }
      });
      return groups;
    },
    // Computed property to check if we are in production (live site)
    isProduction() {
      return process.env.NODE_ENV === "production";
    }
  },
  methods: {
    goToPage(page) {
      this.currentPage = page;
      if (page === "additions") {
        this.loadAllSubmissions();
        this.loadArtistAdditions();
      } else {
        this.loadMeetingData();
      }
    },
    toggleDateDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectDate(date) {
      this.selectedDate = date;
      this.dropdownOpen = false;
      this.loadMeetingData();
    },
    toggleNameDropdown() {
      this.nameDropdownOpen = !this.nameDropdownOpen;
    },
    async selectName(user) {
      this.selectedName = user;
      this.nameDropdownOpen = false;
      await this.loadUserSubmission(user.name);
    },
    async fetchMeetingSubmissions() {
      const q = query(collection(db, "adds"), where("date", "==", this.selectedDate));
      const querySnapshot = await getDocs(q);
      const submissions = [];
      querySnapshot.forEach((doc) => {
        submissions.push({ id: doc.id, ...doc.data() });
      });
      return submissions;
    },
    async loadMeetingData() {
      try {
        const submissions = await this.fetchMeetingSubmissions();
        this.weeklySubmissions = submissions;
        const fastestTimes = {};
        submissions.forEach((sub) => {
          const subTime = sub.timestamp.seconds;
          if (!fastestTimes[sub.name] || subTime < fastestTimes[sub.name]) {
            fastestTimes[sub.name] = subTime;
          }
        });
        this.leaderboardFastestAdds = Object.keys(fastestTimes)
          .map((name) => {
            const user = this.names.find((u) => u.name === name);
            const rawTime = fastestTimes[name];
            return {
              name,
              time: rawTime,
              formattedTime: this.formatDateOnly(rawTime),
              color: user ? user.color : "#000000"
            };
          })
          .sort((a, b) => a.time - b.time);
      } catch (error) {
        console.error("Error loading meeting data:", error);
      }
    },
    async loadAllSubmissions() {
      try {
        const q = query(collection(db, "adds"));
        const querySnapshot = await getDocs(q);
        const submissions = [];
        querySnapshot.forEach((doc) => {
          submissions.push({ id: doc.id, ...doc.data() });
        });
        this.allSubmissions = submissions;
      } catch (error) {
        console.error("Error loading all submissions:", error);
      }
    },
    async loadUserSubmission(userName) {
      const submissions = await this.fetchMeetingSubmissions();
      const userSubmission = submissions.find((sub) => sub.name === userName);
      if (userSubmission) {
        this.newAdditions = userSubmission.newAdditions || "";
        this.dealsToGoOut = userSubmission.dealsToGoOut || "";
        this.outreachUpdates = userSubmission.outreachUpdates || "";
        this.dealsOutWithUpdates = userSubmission.dealsOutWithUpdates || "";
      } else {
        this.newAdditions = "";
        this.dealsToGoOut = "";
        this.outreachUpdates = "";
        this.dealsOutWithUpdates = "";
      }
    },
    async handleSubmit() {
      try {
        const submissions = await this.fetchMeetingSubmissions();
        const existing = submissions.find((sub) => sub.name === this.selectedName.name);
        if (existing) {
          const docRef = doc(db, "adds", existing.id);
          await updateDoc(docRef, {
            date: this.selectedDate,
            newAdditions: this.newAdditions,
            dealsToGoOut: this.dealsToGoOut,
            outreachUpdates: this.outreachUpdates,
            dealsOutWithUpdates: this.dealsOutWithUpdates,
            timestamp: new Date()
          });
        } else {
          await addDoc(collection(db, "adds"), {
            date: this.selectedDate,
            name: this.selectedName.name,
            newAdditions: this.newAdditions,
            dealsToGoOut: this.dealsToGoOut,
            outreachUpdates: this.outreachUpdates,
            dealsOutWithUpdates: this.dealsOutWithUpdates,
            timestamp: new Date()
          });
        }
        await this.loadMeetingData();
        this.currentPage = "leaderboard";
      } catch (error) {
        console.error("Error adding/updating document:", error);
      }
    },
    handleGenerateAgenda() {
      const pass = prompt("Enter password to generate agenda:");
      if (pass === "zathura") {
        this.showAgenda = true;
      } else {
        alert("Incorrect password.");
      }
    },
    async postArtistUpdate(artist) {
      if (!this.artistComments[artist] || !this.artistComments[artist].trim()) {
        alert("Please enter a comment.");
        return;
      }
      try {
        const docId = artist.toLowerCase();
        const docRef = doc(db, "artistAdditions", docId);
        const updateObj = {
          status: this.artistStatuses[artist] ||
            ("Added on " + this.getEarliestAdditionDate(this.allParsedAdditions[artist] || [])),
          comment: this.artistComments[artist],
          contributor: this.selectedName ? this.selectedName.name : "Anonymous",
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })
        };
        try {
          await updateDoc(docRef, { comments: arrayUnion(updateObj) });
        } catch (err) {
          await setDoc(docRef, { comments: [updateObj] });
        }
        this.artistComments[artist] = "";
        await this.loadArtistAdditions();
      } catch (error) {
        console.error("Error posting artist update:", error);
      }
    },
    async loadArtistAdditions() {
      try {
        const q = query(collection(db, "artistAdditions"));
        const querySnapshot = await getDocs(q);
        const additions = {};
        querySnapshot.forEach((doc) => {
          additions[doc.id] = doc.data().comments || [];
        });
        this.artistAdditions = additions;
      } catch (error) {
        console.error("Error loading artist additions:", error);
      }
    },
    getUserColor(name) {
      const user = this.names.find((u) => u.name === name);
      return user ? user.color : "#000000";
    },
    getArtistColor(artist) {
      const user = this.names.find(u => u.name.toLowerCase() === artist.toLowerCase());
      return user ? user.color : "#4B5563";
    },
    formatDateOnly(seconds) {
      const date = new Date(seconds * 1000);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("en-US", options);
    },
    formatDate(timestamp) {
      if (!timestamp || !timestamp.seconds) return "";
      const date = new Date(timestamp.seconds * 1000);
      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },
    getEarliestAdditionDate(contributions) {
      if (!contributions || contributions.length === 0) return "";
      const first = contributions[0];
      if (first.timestamp && first.timestamp.seconds) {
        return this.formatDate(first.timestamp);
      }
      return "";
    },
    formatHeaderDate(dateStr) {
      const parts = dateStr.split("/");
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString("en-US", { weekday: "short", month: "2-digit", day: "2-digit" });
    },
    getToday() {
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    },
    handleClickOutside(event) {
      if (!this.$el.querySelector("header").contains(event.target)) {
        this.dropdownOpen = false;
      }
      if (this.$refs.nameDropdownWrapper && !this.$refs.nameDropdownWrapper.contains(event.target)) {
        this.nameDropdownOpen = false;
      }
    }
  },
  async mounted() {
    document.addEventListener("click", this.handleClickOutside);
    // Set selectedDate to our computed next meeting date.
    if (!this.selectedDate) {
      this.selectedDate = this.nextMeetingDateRaw;
    }
    await this.loadMeetingData();
    this.loadArtistAdditions();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
