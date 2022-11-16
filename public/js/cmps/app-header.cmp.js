import loginSignup from "./login-signup.cmp.js"
import { userService } from "../services/user-service.js"


export default {
    template: `
        <header>
            <h1>Miss Bug</h1>   
            <section v-if="user">
            <p>
                Welcome {{user.fullname}} | 
                <button @click="logout">Logout</button> |
                <router-link :to="'/auth/'+user._id"><button @click="">Profile</button></router-link> |

                <router-link v-if="user.isAdmin" :to="'/admin'"><button @click=""> Admin page</button>
                </router-link>
            </p>   
       </section>
       <section v-else>
            <login-signup @onChangeLoginStatus="onChangeLoginStatus"></login-signup>
       </section>
        </header>
    `,
    data() {
        return {
            user: userService.getLoggedinUser()
        }
    },
    methods: {
        onChangeLoginStatus() {
            console.log('changing status')
            this.user = userService.getLoggedinUser()
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.user = null
                    this.$router.push('/bug')
                })
        }

    },
    components: {
        loginSignup
    }


}
