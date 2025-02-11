<template>
  <div class="min-h-screen bg-amber-50 text-gray-900">
    <!-- HEADER: Date, Search, Navigation -->
    <header class="w-full py-6 sm:py-12 bg-amber-100 shadow-md relative">
      <div class="w-full px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center">
        <!-- Title & Next Meeting Date -->
        <div class="mb-4 sm:mb-0">
          <h1 class="text-3xl sm:text-6xl font-extrabold tracking-wide text-center sm:text-left">
            10K PROJECTS ADDS FOR
            <span class="ml-2 relative inline-block">
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
                  <li
                    @click="selectDate(nextMeetingDateRaw)"
                    class="px-4 py-2 hover:bg-amber-200 cursor-pointer text-lg font-bold"
                  >
                    {{ nextMeetingDisplay }}
                  </li>
                </ul>
              </div>
            </span>
          </h1>
        </div>
        <!-- Search Box (also used for admin easter egg) -->
        <div class="w-full sm:w-auto">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search..."
            class="w-full sm:w-64 px-4 py-2 border rounded"
          />
        </div>
      </div>
      <!-- Navigation Buttons -->
      <div class="w-full px-4 sm:px-8 mt-4 flex flex-wrap justify-center sm:justify-end gap-2">
        <button
          @click="goToPage('form')"
          :class="
            currentPage === 'form' ? 'bg-gray-900 text-amber-50' : 'bg-gray-200 text-gray-900'
          "
          class="px-4 py-2 rounded uppercase text-sm"
        >
          Home
        </button>
        <button
          @click="goToPage('leaderboard')"
          :class="
            currentPage === 'leaderboard'
              ? 'bg-gray-900 text-amber-50'
              : 'bg-gray-200 text-gray-900'
          "
          class="px-4 py-2 rounded uppercase text-sm"
        >
          Leaderboard
        </button>
        <button
          @click="goToPage('additions')"
          :class="
            currentPage === 'additions' ? 'bg-gray-900 text-amber-50' : 'bg-gray-200 text-gray-900'
          "
          class="px-4 py-2 rounded uppercase text-sm"
        >
          Additions
        </button>
      </div>
    </header>

    <!-- SEARCH RESULTS -->
    <div v-if="searchTerm.trim() !== ''" class="w-full px-4 sm:px-8 mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold mb-4">Search Results</h2>
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
    <main class="w-full px-4 sm:px-8 py-8 sm:py-16 space-y-8">
      <!-- FORM PAGE -->
      <div v-if="currentPage === 'form'">
        <div v-if="isMeetingArchived" class="text-center text-red-700 font-bold mb-4">
          This meeting is archived. Submissions are no longer editable.
        </div>
        <!-- Name Dropdown -->
        <div class="relative flex justify-center mb-4" ref="nameDropdownWrapper">
          <div
            class="cursor-pointer text-xl sm:text-3xl font-bold border-b-2 border-dashed border-black flex items-center"
            @click="toggleNameDropdown"
          >
            <span
              v-if="selectedName"
              class="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2"
              :style="{ backgroundColor: selectedName.color }"
            ></span>
            <span v-if="selectedName" :class="{ 'line-through': selectedName.submitted }">{{
              selectedName.name
            }}</span>
            <span v-else>Select Your Name</span>
          </div>
          <div
            v-if="nameDropdownOpen"
            class="absolute mt-2 bg-amber-50 border border-gray-300 rounded shadow-md z-10"
          >
            <ul>
              <li
                v-for="(user, index) in names"
                :key="index"
                @click="selectName(user)"
                class="px-4 py-2 hover:bg-amber-200 cursor-pointer text-lg font-bold flex items-center"
                :class="{ 'line-through opacity-50': user.submitted }"
              >
                <span
                  class="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2"
                  :style="{ backgroundColor: user.color }"
                ></span>
                {{ user.name }}
              </li>
            </ul>
          </div>
        </div>
        <!-- Submission Fields -->
        <div v-if="selectedName" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-lg font-bold mb-1">New Additions:</label>
            <textarea
              v-model="newAdditions"
              :disabled="isMeetingArchived"
              placeholder="Enter new additions..."
              class="w-full p-2 border rounded resize-none"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label class="block text-lg font-bold mb-1">Deals To Go Out:</label>
            <textarea
              v-model="dealsToGoOut"
              :disabled="isMeetingArchived"
              placeholder="Enter deals to go out..."
              class="w-full p-2 border rounded resize-none"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label class="block text-lg font-bold mb-1">Outreach Updates:</label>
            <textarea
              v-model="outreachUpdates"
              :disabled="isMeetingArchived"
              placeholder="Enter outreach updates..."
              class="w-full p-2 border rounded resize-none"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label class="block text-lg font-bold mb-1">Deals Out With Updates:</label>
            <textarea
              v-model="dealsOutWithUpdates"
              :disabled="isMeetingArchived"
              placeholder="Enter deals out with updates..."
              class="w-full p-2 border rounded resize-none"
              rows="4"
            ></textarea>
          </div>
        </div>
        <!-- Submit Button -->
        <div v-if="selectedName && !isMeetingArchived" class="flex justify-center mt-4">
          <button
            type="button"
            @click="handleSubmit"
            class="bg-gray-900 hover:bg-gray-800 transition duration-300 text-amber-50 font-bold py-3 px-8 rounded uppercase tracking-wider"
          >
            Submit
          </button>
        </div>
      </div>

      <!-- LEADERBOARD PAGE -->
      <div v-if="currentPage === 'leaderboard'">
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          <button
            @click="leaderboardTab = 'most'"
            :class="
              leaderboardTab === 'most' ? 'bg-gray-900 text-amber-50' : 'bg-gray-200 text-gray-900'
            "
            class="px-4 py-2 rounded uppercase font-bold text-sm"
          >
            Most Adds
          </button>
          <button
            @click="leaderboardTab = 'fastest'"
            :class="
              leaderboardTab === 'fastest'
                ? 'bg-gray-900 text-amber-50'
                : 'bg-gray-200 text-gray-900'
            "
            class="px-4 py-2 rounded uppercase font-bold text-sm"
          >
            Fastest Adds
          </button>
        </div>
        <div>
          <ul>
            <li
              v-for="(entry, index) in currentLeaderboard"
              :key="index"
              class="flex items-center justify-between border-b border-gray-300 py-2 text-base sm:text-xl"
            >
              <div class="flex items-center">
                <span
                  class="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2"
                  :style="{ backgroundColor: entry.color }"
                ></span>
                <span>{{ entry.name }}</span>
              </div>
              <div>
                <span v-if="leaderboardTab === 'most'">{{ entry.count }} Adds</span>
                <span v-else>{{ entry.formattedTime }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="flex justify-center mt-4">
          <button
            @click="handleGenerateAgenda"
            class="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-bold py-2 px-4 rounded text-sm"
          >
            GENERATE AGENDA
          </button>
        </div>
        <!-- Generated Agenda Section -->
        <div v-if="currentPage === 'leaderboard' && showAgenda" class="mt-12 text-left">
          <h2 class="text-4xl font-bold mb-8">Meeting Agenda</h2>
          <!-- New Additions Section -->
          <div class="mb-8">
            <h3 class="text-3xl font-bold mb-4">New Additions</h3>
            <div
              v-for="(contributions, name) in groupedAgendaNewAdditions"
              :key="name"
              class="max-w-2xl mb-4 p-4 border rounded shadow-sm bg-white"
            >
              <div class="flex items-center mb-2">
                <span
                  class="w-4 h-4 rounded-full mr-2"
                  :style="{ backgroundColor: getUserColor(name) }"
                ></span>
                <span class="font-bold text-xl">{{ name }}</span>
              </div>
              <div
                class="whitespace-pre-wrap text-lg"
                v-for="(item, index) in contributions"
                :key="index"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <!-- Deals To Go Out Section -->
          <div class="mb-8">
            <h3 class="text-3xl font-bold mb-4">Deals To Go Out</h3>
            <div
              v-for="(contributions, name) in groupedAgendaDealsToGoOut"
              :key="name"
              class="max-w-2xl mb-4 p-4 border rounded shadow-sm bg-white"
            >
              <div class="flex items-center mb-2">
                <span
                  class="w-4 h-4 rounded-full mr-2"
                  :style="{ backgroundColor: getUserColor(name) }"
                ></span>
                <span class="font-bold text-xl">{{ name }}</span>
              </div>
              <div
                class="whitespace-pre-wrap text-lg"
                v-for="(item, index) in contributions"
                :key="index"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <!-- Outreach Updates Section -->
          <div class="mb-8">
            <h3 class="text-3xl font-bold mb-4">Outreach Updates</h3>
            <div
              v-for="(contributions, name) in groupedAgendaOutreachUpdates"
              :key="name"
              class="max-w-2xl mb-4 p-4 border rounded shadow-sm bg-white"
            >
              <div class="flex items-center mb-2">
                <span
                  class="w-4 h-4 rounded-full mr-2"
                  :style="{ backgroundColor: getUserColor(name) }"
                ></span>
                <span class="font-bold text-xl">{{ name }}</span>
              </div>
              <div
                class="whitespace-pre-wrap text-lg"
                v-for="(item, index) in contributions"
                :key="index"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <!-- Deals Out With Updates Section -->
          <div class="mb-8">
            <h3 class="text-3xl font-bold mb-4">Deals Out With Updates</h3>
            <div
              v-for="(contributions, name) in groupedAgendaDealsOutWithUpdates"
              :key="name"
              class="max-w-2xl mb-4 p-4 border rounded shadow-sm bg-white"
            >
              <div class="flex items-center mb-2">
                <span
                  class="w-4 h-4 rounded-full mr-2"
                  :style="{ backgroundColor: getUserColor(name) }"
                ></span>
                <span class="font-bold text-xl">{{ name }}</span>
              </div>
              <div
                class="whitespace-pre-wrap text-lg"
                v-for="(item, index) in contributions"
                :key="index"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Panel -->
        <div v-if="isAdmin" class="p-4 bg-gray-200 mt-8 rounded">
          <h2 class="text-xl font-bold mb-2">Admin Panel</h2>
          <ul>
            <li
              v-for="submission in weeklySubmissions"
              :key="submission.id"
              class="mb-2 flex items-center justify-between border p-2 rounded"
            >
              <span>{{ submission.name }} — {{ formatDate(submission.timestamp) }}</span>
              <button
                @click="deleteSubmission(submission.id)"
                class="bg-red-600 text-amber-50 px-3 py-1 rounded text-sm"
              >
                Delete Submission
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- ADDITIONS PAGE -->
      <div v-if="currentPage === 'additions'">
        <!-- In production, show a simple Work In Progress message -->
        <div v-if="isProduction" class="flex flex-col items-center justify-center py-16">
          <h2 class="text-4xl font-bold mb-4">Additions</h2>
          <p class="text-2xl text-gray-700">Work In Progress</p>
        </div>
        <!-- In development, show the full Additions interface -->
        <div v-else>
          <h2 class="text-4xl font-bold text-left mb-8">Additions</h2>
          <div class="flex flex-wrap justify-center gap-4">
            <div
              v-for="(contributions, artist) in allParsedAdditions"
              :key="artist"
              class="w-full sm:w-1/2 md:w-1/3 p-4 border rounded shadow-sm bg-white"
            >
              <div class="flex flex-col sm:flex-row items-start justify-between mb-2">
                <div class="flex items-center mb-2 sm:mb-0">
                  <span
                    class="w-4 h-4 rounded-full mr-2"
                    :style="{ backgroundColor: getArtistColor(artist) }"
                  ></span>
                  <span class="font-bold text-xl">{{ artist }}</span>
                  <span class="ml-2 text-sm text-gray-600"
                    >[Added on {{ getEarliestAdditionDate(contributions) }}]</span
                  >
                </div>
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
              <div v-if="artistAdditions[artist] && artistAdditions[artist].length" class="mt-2">
                <h4 class="font-bold text-base mb-1">Status Updates:</h4>
                <div class="space-y-1">
                  <div
                    v-for="(update, idx) in artistAdditions[artist]"
                    :key="idx"
                    class="p-1 bg-gray-100 rounded text-xs"
                  >
                    <div class="font-semibold">{{ update.status }}</div>
                    <div>{{ update.comment }}</div>
                    <div class="text-xs text-gray-500">
                      {{ update.date }} - {{ update.contributor }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- Display Parsed Contributions with admin delete buttons if isAdmin -->
              <div class="mt-2">
                <h4 class="font-bold text-base mb-1">Parsed Contributions:</h4>
                <div class="space-y-1">
                  <div
                    v-for="(item, index) in contributions"
                    :key="index"
                    class="p-1 bg-gray-50 rounded border text-xs"
                  >
                    <div>{{ item.comment }}</div>
                    <div class="text-gray-500">
                      – from {{ item.contributor }}, {{ formatDate(item.timestamp) }}
                    </div>
                    <div v-if="isAdmin" class="mt-1">
                      <button
                        @click="deleteParsedContribution(item.submissionId, index)"
                        class="text-red-600 text-xs"
                      >
                        Delete
                      </button>
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
import { db } from '@/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore'

export default {
  name: 'MinimalForm',
  data() {
    return {
      selectedDate: '',
      dropdownOpen: false,
      names: [
        { name: 'Arya', color: '#EF4444', submitted: false },
        { name: 'Chris', color: '#F59E0B', submitted: false },
        { name: 'Charlie', color: '#10B981', submitted: false },
        { name: 'Christian', color: '#3B82F6', submitted: false },
        { name: 'Benicio', color: '#8B5CF6', submitted: false },
        { name: 'Sam', color: '#EC4899', submitted: false },
        { name: 'Akiva', color: '#F472B6', submitted: false },
        { name: 'Lucas', color: '#06B6D4', submitted: false },
        { name: 'Bayley', color: '#4ADE80', submitted: false },
        { name: 'Anthony', color: '#34D399', submitted: false },
        { name: 'Sami', color: '#9333EA', submitted: false },
        { name: 'Porter', color: '#6366F1', submitted: false },
      ],
      selectedName: null,
      nameDropdownOpen: false,
      newAdditions: '',
      dealsToGoOut: '',
      outreachUpdates: '',
      dealsOutWithUpdates: '',
      currentPage: 'form',
      leaderboardTab: 'most',
      leaderboardFastestAdds: [],
      weeklySubmissions: [],
      allSubmissions: [],
      artistAdditions: {},
      artistStatuses: {},
      artistComments: {},
      showAgenda: false,
      searchTerm: '',
      isAdmin: false,
      // For demo purposes, we'll assume isMeetingArchived is false.
      isMeetingArchived: false,
    }
  },
  computed: {
    formatLocalDate() {
      return (date) => {
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const day = ('0' + date.getDate()).slice(-2)
        return `${year}/${month}/${day}`
      }
    },
    nextMeetingDateRaw() {
      const today = new Date()
      const day = today.getDay()
      if (day === 2 || day === 5) {
        return this.formatLocalDate(today)
      }
      const offsetTuesday = (2 - day + 7) % 7 || 7
      const offsetFriday = (5 - day + 7) % 7 || 7
      const meetingOffset = Math.min(offsetTuesday, offsetFriday)
      const meetingDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + meetingOffset,
      )
      return this.formatLocalDate(meetingDate)
    },
    nextMeetingDisplay() {
      const todayStr = this.formatLocalDate(new Date())
      if (this.nextMeetingDateRaw === todayStr) {
        return 'Today'
      } else {
        const parts = this.nextMeetingDateRaw.split('/')
        const d = new Date(parts[0], parts[1] - 1, parts[2])
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: '2-digit',
          day: '2-digit',
        })
      }
    },
    searchResults() {
      const term = this.searchTerm.toLowerCase()
      return this.weeklySubmissions.filter((sub) => {
        return (
          sub.name.toLowerCase().includes(term) ||
          (sub.newAdditions && sub.newAdditions.toLowerCase().includes(term)) ||
          (sub.dealsToGoOut && sub.dealsToGoOut.toLowerCase().includes(term)) ||
          (sub.outreachUpdates && sub.outreachUpdates.toLowerCase().includes(term)) ||
          (sub.dealsOutWithUpdates && sub.dealsOutWithUpdates.toLowerCase().includes(term))
        )
      })
    },
    parsedLeaderboard() {
      const counts = {}
      this.weeklySubmissions.forEach((sub) => {
        if (sub.newAdditions) {
          const lines = sub.newAdditions.split(/\r?\n/).filter((line) => line.trim() !== '')
          let parsedCount = 0
          lines.forEach((line) => {
            if (line.trim().match(/^(.+?)\s*(?::|-)\s*(.+)$/)) {
              parsedCount++
            }
          })
          if (sub.name) {
            counts[sub.name] = (counts[sub.name] || 0) + parsedCount
          }
        }
      })
      return Object.keys(counts)
        .map((name) => {
          const user = this.names.find((u) => u.name === name)
          return {
            name,
            count: counts[name],
            color: user ? user.color : '#000000',
          }
        })
        .sort((a, b) => b.count - a.count)
    },
    groupedAgendaNewAdditions() {
      const groups = {}
      this.weeklySubmissions.forEach((sub) => {
        if (sub.newAdditions && sub.newAdditions.trim() !== '') {
          if (!groups[sub.name]) groups[sub.name] = []
          groups[sub.name].push(sub.newAdditions)
        }
      })
      return groups
    },
    groupedAgendaDealsToGoOut() {
      const groups = {}
      this.weeklySubmissions.forEach((sub) => {
        if (sub.dealsToGoOut && sub.dealsToGoOut.trim() !== '') {
          if (!groups[sub.name]) groups[sub.name] = []
          groups[sub.name].push(sub.dealsToGoOut)
        }
      })
      return groups
    },
    groupedAgendaOutreachUpdates() {
      const groups = {}
      this.weeklySubmissions.forEach((sub) => {
        if (sub.outreachUpdates && sub.outreachUpdates.trim() !== '') {
          if (!groups[sub.name]) groups[sub.name] = []
          groups[sub.name].push(sub.outreachUpdates)
        }
      })
      return groups
    },
    groupedAgendaDealsOutWithUpdates() {
      const groups = {}
      this.weeklySubmissions.forEach((sub) => {
        if (sub.dealsOutWithUpdates && sub.dealsOutWithUpdates.trim() !== '') {
          if (!groups[sub.name]) groups[sub.name] = []
          groups[sub.name].push(sub.dealsOutWithUpdates)
        }
      })
      return groups
    },
    isProduction() {
      return process.env.NODE_ENV === 'production'
    },
    currentLeaderboard() {
      return this.leaderboardTab === 'most' ? this.parsedLeaderboard : this.leaderboardFastestAdds
    },
  },
  watch: {
    searchTerm(newVal) {
      if (newVal === 'letmeinadmin') {
        this.isAdmin = true
        this.searchTerm = ''
      }
    },
  },
  methods: {
    goToPage(page) {
      this.currentPage = page
      if (page === 'additions') {
        this.loadAllSubmissions()
        this.loadArtistAdditions()
      } else {
        this.loadMeetingData()
      }
    },
    toggleDateDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    selectDate(date) {
      this.selectedDate = date
      this.dropdownOpen = false
      this.loadMeetingData()
    },
    toggleNameDropdown() {
      this.nameDropdownOpen = !this.nameDropdownOpen
    },
    async selectName(user) {
      this.selectedName = user
      this.nameDropdownOpen = false
      await this.loadUserSubmission(user.name)
    },
    async fetchMeetingSubmissions() {
      const q = query(collection(db, 'adds'), where('date', '==', this.selectedDate))
      const querySnapshot = await getDocs(q)
      const submissions = []
      querySnapshot.forEach((doc) => {
        submissions.push({ id: doc.id, ...doc.data() })
      })
      return submissions
    },
    async loadMeetingData() {
      try {
        const submissions = await this.fetchMeetingSubmissions()
        this.weeklySubmissions = submissions

        // Update submitted flag for names based on current meeting submissions.
        this.names = this.names.map((user) => ({
          ...user,
          submitted: submissions.some((sub) => sub.name === user.name),
        }))

        const fastestTimes = {}
        submissions.forEach((sub) => {
          const subTime = sub.timestamp.seconds
          if (!fastestTimes[sub.name] || subTime < fastestTimes[sub.name]) {
            fastestTimes[sub.name] = subTime
          }
        })
        this.leaderboardFastestAdds = Object.keys(fastestTimes)
          .map((name) => {
            const user = this.names.find((u) => u.name === name)
            const rawTime = fastestTimes[name]
            return {
              name,
              time: rawTime,
              formattedTime: this.formatDateOnly(rawTime),
              color: user ? user.color : '#000000',
            }
          })
          .sort((a, b) => a.time - b.time)
      } catch (error) {
        console.error('Error loading meeting data:', error)
      }
    },
    async loadAllSubmissions() {
      try {
        const q = query(collection(db, 'adds'))
        const querySnapshot = await getDocs(q)
        const submissions = []
        querySnapshot.forEach((doc) => {
          submissions.push({ id: doc.id, ...doc.data() })
        })
        this.allSubmissions = submissions
      } catch (error) {
        console.error('Error loading all submissions:', error)
      }
    },
    async loadUserSubmission(userName) {
      const submissions = await this.fetchMeetingSubmissions()
      const userSubmission = submissions.find((sub) => sub.name === userName)
      if (userSubmission) {
        this.newAdditions = userSubmission.newAdditions || ''
        this.dealsToGoOut = userSubmission.dealsToGoOut || ''
        this.outreachUpdates = userSubmission.outreachUpdates || ''
        this.dealsOutWithUpdates = userSubmission.dealsOutWithUpdates || ''
      } else {
        this.newAdditions = ''
        this.dealsToGoOut = ''
        this.outreachUpdates = ''
        this.dealsOutWithUpdates = ''
      }
    },
    async handleSubmit() {
      try {
        const submissions = await this.fetchMeetingSubmissions()
        const existing = submissions.find((sub) => sub.name === this.selectedName.name)
        if (existing) {
          const docRef = doc(db, 'adds', existing.id)
          await updateDoc(docRef, {
            date: this.selectedDate,
            newAdditions: this.newAdditions,
            dealsToGoOut: this.dealsToGoOut,
            outreachUpdates: this.outreachUpdates,
            dealsOutWithUpdates: this.dealsOutWithUpdates,
            timestamp: new Date(),
          })
        } else {
          await addDoc(collection(db, 'adds'), {
            date: this.selectedDate,
            name: this.selectedName.name,
            newAdditions: this.newAdditions,
            dealsToGoOut: this.dealsToGoOut,
            outreachUpdates: this.outreachUpdates,
            dealsOutWithUpdates: this.dealsOutWithUpdates,
            timestamp: new Date(),
          })
        }
        // Mark the user as submitted so their name is crossed out in the dropdown.
        this.names = this.names.map((user) => {
          if (user.name === this.selectedName.name) {
            return { ...user, submitted: true }
          }
          return user
        })
        await this.loadMeetingData()
        this.currentPage = 'leaderboard'
      } catch (error) {
        console.error('Error adding/updating document:', error)
      }
    },
    handleGenerateAgenda() {
      const pass = prompt('Enter password to generate agenda:')
      if (pass === 'zathura') {
        this.showAgenda = true
      } else {
        alert('Incorrect password.')
      }
    },
    async postArtistUpdate(artist) {
      if (!this.artistComments[artist] || !this.artistComments[artist].trim()) {
        alert('Please enter a comment.')
        return
      }
      try {
        const docId = artist.toLowerCase()
        const docRef = doc(db, 'artistAdditions', docId)
        const updateObj = {
          status:
            this.artistStatuses[artist] ||
            'Added on ' + this.getEarliestAdditionDate(this.allParsedAdditions[artist] || []),
          comment: this.artistComments[artist],
          contributor: this.selectedName ? this.selectedName.name : 'Anonymous',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        }
        try {
          await updateDoc(docRef, { comments: arrayUnion(updateObj) })
        } catch (err) {
          await setDoc(docRef, { comments: [updateObj] })
        }
        this.artistComments[artist] = ''
        await this.loadArtistAdditions()
      } catch (error) {
        console.error('Error posting artist update:', error)
      }
    },
    async loadArtistAdditions() {
      try {
        const q = query(collection(db, 'artistAdditions'))
        const querySnapshot = await getDocs(q)
        const additions = {}
        querySnapshot.forEach((doc) => {
          additions[doc.id] = doc.data().comments || []
        })
        this.artistAdditions = additions
      } catch (error) {
        console.error('Error loading artist additions:', error)
      }
    },
    getUserColor(name) {
      const user = this.names.find((u) => u.name === name)
      return user ? user.color : '#000000'
    },
    getArtistColor(artist) {
      const user = this.names.find((u) => u.name.toLowerCase() === artist.toLowerCase())
      return user ? user.color : '#4B5563'
    },
    formatDateOnly(seconds) {
      const date = new Date(seconds * 1000)
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
      return date.toLocaleDateString('en-US', options)
    },
    formatDate(timestamp) {
      if (!timestamp || !timestamp.seconds) return ''
      const date = new Date(timestamp.seconds * 1000)
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    },
    getEarliestAdditionDate(contributions) {
      if (!contributions || contributions.length === 0) return ''
      const first = contributions[0]
      if (first.timestamp && first.timestamp.seconds) {
        return this.formatDate(first.timestamp)
      }
      return ''
    },
    formatHeaderDate(dateStr) {
      const parts = dateStr.split('/')
      const d = new Date(parts[0], parts[1] - 1, parts[2])
      return d.toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit' })
    },
    getToday() {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    handleClickOutside(event) {
      if (!this.$el.querySelector('header').contains(event.target)) {
        this.dropdownOpen = false
      }
      if (
        this.$refs.nameDropdownWrapper &&
        !this.$refs.nameDropdownWrapper.contains(event.target)
      ) {
        this.nameDropdownOpen = false
      }
    },
    deleteParsedContribution(submissionId, contributionIndex) {
      console.log(
        `Request to delete contribution #${contributionIndex} from submission ${submissionId}`,
      )
      alert('Delete functionality is not fully implemented in this demo.')
    },
    async deleteSubmission(submissionId) {
      if (confirm('Are you sure you want to delete this submission?')) {
        try {
          await deleteDoc(doc(db, 'adds', submissionId))
          await this.loadMeetingData()
        } catch (error) {
          console.error('Error deleting submission:', error)
        }
      }
    },
  },
  async mounted() {
    document.addEventListener('click', this.handleClickOutside)
    if (!this.selectedDate) {
      this.selectedDate = this.nextMeetingDateRaw
    }
    await this.loadMeetingData()
    this.loadArtistAdditions()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
