import { userService } from "../services/user-service.js"

export default {
    template: `
    <h1>Admin page</h1>
    <table border="solid">
        <tr><th>id</th><th>Username</th><th>Full name</th><th>Admin?</th><th>Actions</th></tr>
        <tr v-for="user in users">
        <td>{{user._id}}</td><td>{{user.username}}</td><td>{{user.fullname}}</td><td>{{user.isAdmin}}</td><td><button v-if="!user.isAdmin" @click="deleteUser(user._id)">Delete</button></td>        </tr>
    </table>
    <router-link to="/bug">Back</router-link>

    `,
    data() {
        return {
            users: null,
        }
    },
    created() {
        this.loadUsers()
    },
    methods: {
        loadUsers() {
            userService.getAllUsers()
                .then(users => this.users = users)

        }
        ,
        deleteUser(userId) {
            console.log('deleting', userId)
            userService.remove(userId)
            this.loadUsers()
        }
    },
    components: {
        userService
    }
}