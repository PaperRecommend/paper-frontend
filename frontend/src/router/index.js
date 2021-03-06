import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'

import MainPage from '@/views/mainpage'
import SearchRes from '@/views/result'

import Sort from "@/views/sort"

import AuthorProfile from "@/views/authorProfile"

import ConferenceProfile from "@/views/conferenceProfile"
import FieldProfile from "@/views/fieldProfile"
import Login from "@/views/login"
import Register from "@/views/register"
import Collection from "@/views/Collection"

// import Trend from "@/views/trend"


import {getRequest} from "../utils/request"
import Rank from "../components/Rank";
import Recommend from "../views/Recommend";

Vue.use(Router)

const router= new Router({

  mode: "history",

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },

  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: "Login",
      component: Login,
    },
    {
      path: '/register',
      name: "Register",
      component: Register,
    },
    {
      path: '/mainpage',
      name: "MainPage",
      component: MainPage,
    },
    {
      path: '/rank',
      name: "Rank",
      component: Rank,
    },
    {
      path: '/result',
      name: "SearchRes",
      component: SearchRes,
    },
    {
      path: "/sort",
      name: "Sort",
      component: Sort
    },
    {
      path: "/author-profile",
      name: "AuthorProfile",
      component: AuthorProfile
    },
    {
      path: "/conference-profile",
      name: "ConferenceProfile",
      component: ConferenceProfile
    },
    {
      path: "/field-profile",
      name: "FieldProfile",
      component: FieldProfile
    },
    {
      path: "/collection",
      name: "collection",
      component: Collection
    },
    {
      path: "/recommend",
      name: "recommend",
      component: Recommend
    }

  ],
});

//   router.beforeEach((to, from, next) => {
//   if (to.name == 'Admin') {
//     next();
//   } else {
//     getRequest("/api/permission/paper").then((response) => {
//       if (response.data) {
//         next();
//       }
//       else {
//         console.log("error");
//         if (to.name != 'MainPage') {
//           Message({
//             type: "warning",
//             message: 'Data has not been initialized.',
//             center: true
//           })
//           next("/mainpage");
//         } else {
//           next();
//         }
//       }
//     })
//       .catch(err => {
//         console.log("err")
//         Message({
//           type: "error",
//           message: '?????????????????????????????????????????????',
//           center: true
//         })
//       })
//   }

// })

export default router;
