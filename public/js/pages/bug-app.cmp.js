'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
      <div class="subheader">
        
        <router-link to="/bug/edit">Add New Bug</router-link> ||
        <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
        <a href="http://127.0.0.1:3031/api/bug/pdf" >Download bug PDF</a>
      </div>
      <div v-if="totalPages" class="subheader">
        <button v-if="filterBy.page > 0" @click="setPage(-1)">Prev</button>
        Page {{filterBy.page+1}} of {{totalPages}}
        <button v-if="filterBy.page < totalPages-1" @click="setPage(1)">Next</button>
      </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        page: 0,
      },
      totalPages: 0,
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(({ totalPages, filteredBugs }) => {
        this.bugs = filteredBugs
        this.totalPages = totalPages
      })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page }
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
    setPage(dif) {
      console.log(dif)
      this.filterBy.page += dif
      this.loadBugs()
    }
  },
  components: {
    bugList,
    bugFilter,
  },
}
