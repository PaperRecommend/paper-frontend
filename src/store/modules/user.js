
import router from '@/router'
import { setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'
import {
    loginAPI,
    registerAPI,
    getUserInfoAPI,
    updateUserInfoAPI,
} from '@/api/user'

const getDefaultState = () => {
    return {
        userId: '',
        userInfo: {

        },
        vipLevel:0,
        userOrderList: [

        ],
        iconChoose: "",
        iconChooseVisible: false,
        creditChargeVisible: false,
    }
}

const user = {
    state : getDefaultState(),

    mutations: {
        reset_state: function(state) {
            state.token = ''
            state.userInfo = {}
            state.userId = ''
            state.userOrderList = []
            state.iconChoose = ""
            state.iconChooseVisible = false
            state.creditChargeVisible = false
        },
        set_token: function(state, token){
            state.token = token
        },
        set_email: (state, data) => {
            state.email = data
        },
        set_userId: (state, data) => {
            state.userId = data
        },
        set_userInfo: (state, data) => {
            state.userInfo = {
                ...state.userInfo,
                ...data
            }
        },
    },

    actions: {
        login: async ({ dispatch, commit }, userData) => {
            const res = await loginAPI(userData)
            if(res){
                setToken(res.id)
                commit('set_userId', res.id)
                commit('set_iconChoose',res.avatar)
                dispatch('getUserInfo')
                router.push('/hotel/hotelList')
            }
        },
        register: async(data) => {
            const res = await registerAPI(data)
            if(res){
                Message.success('注册成功')
            }
        },
        getUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
              getUserInfoAPI(state.userId).then(response => {
                const data = response
                if (!data) {
                  reject('登录已过期，请重新登录')
                }
                commit('set_userInfo', data)
                commit('set_userId', data.id)
                resolve(data)
              }).catch(error => {
                reject(error)
              })
            })
        },

        //更新用户信息
        updateUserInfo: async({ state, dispatch }, data) => {
            const params = {
                id: state.userId,
                ...data,
            }
            const res = await updateUserInfoAPI(params)
            if(res){
                Message.success('修改成功')
                dispatch('getUserInfo')
            }
        },


        logout: async({ commit }) => {
            removeToken()
            resetRouter()
            commit('reset_state')
        },
          // remove token
        resetToken({ commit }) {
            return new Promise(resolve => {
                removeToken() // must remove  token  first
                commit('reset_state')
                resolve()
            })
        },

    }
}

export default user