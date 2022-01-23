const getters = {
  //user
  token: state => state.user.token,
  userId: state => state.user.userId,
  userInfo: state => state.user.userInfo,
  vipLevel:state=>state.user.vipLevel,
  userOrderList: state => state.user.userOrderList,
  iconChoose: state => state.user.iconChoose,
  iconChooseVisible: state => state.user.iconChooseVisible,
  creditChargeVisible: state => state.user.creditChargeVisible,


  }

  export default getters