'use strict'

import { bugService } from '../services/bug-service.js'
import { userService } from '../services/user-service.js'

import bugList from '../cmps/bug-list.cmp.js'


export default {
    template: `
    <section v-if="user" class="user-details">
      <h1>{{user.fullname}}</h1>
      <h2>Username: {{user.username}}</h2>
        <pre> Description: {{user}} </pre>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
    data() {
        return {
            user: null,
            bugs: null
        }
    },

    created() {
        const { userId } = this.$route.params
        if (userId) {
            userService.getById(userId)
                .then(user => {
                    this.user = user
                    bugService.getByUser(this.user._id)
                        .then(bugs => this.bugs = bugs)

                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    components: {
        bugList,
    }
}