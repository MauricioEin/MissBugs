'use strict'

import { bugService } from '../services/bug-service.js'

export default {
  template: `
    <section class="bug-details">
      <div v-if="err" class="err-modal">
        <h1>- ERROR -</h1>
        <h2>{{errData}}</h2>
      </div>
      <h1 v-if="bug" >{{bug.title}}</h1>
        <p v-if="bug" >Description: {{bug.description}} </p>
        <span  v-if="bug" :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
      err: null,
      errData: null,
    }
  },

  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId)
        .then((bug) => {
          this.bug = bug
        })
        .catch(err => {
          console.log(err)
          this.err = err
          this.errData = err.response.data
        })
    }
  },
}
