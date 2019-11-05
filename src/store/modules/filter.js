
const state = {
  queryData: {
    pageIndex: 1,
    pageSize: 10
  }
}

const mutations = {
  SET_QUERY_DATA: (state, queryData) => {
    state.queryData = queryData
  }
}

const actions = {
  setFilter({ commit }, data) {
    commit('SET_QUERY_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
