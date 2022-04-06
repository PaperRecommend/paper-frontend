import router from './router'
// import store from './store'
import { getToken,removeToken} from "./utils/auth";
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress bar
  // NProgress.start()
  // determine whether the user has logged in
  // removeToken()
  const hasToken = getToken()
  if (hasToken) {


    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/mainpage'})
      console.log("跳转到mainpage")
      NProgress.done()
    } else {
      next()
      // NProgress.done()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
      // NProgress.done()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      // NProgress.done()
    }
  }
})


