import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todoList: localStorage.getItem("todo-list-v2") ? JSON.parse(localStorage.getItem("todo-list-v2")) : []
  },
  getters: {
    getTodoList(state) {
      return state.todoList
    }
  },
  mutations: {
    addItem(state, payload) {
      state.todoList.push(payload)
      saveLocalStorage(state.todoList)
    },
    editItem(state, payload) {
      state.todoList.splice(payload.index, 1, payload.data)
      saveLocalStorage(state.todoList)
    },
    deleteItem(state, index) {
      state.todoList.splice(index, 1)
      saveLocalStorage(state.todoList)
    },
    checkAll(state, payload) {
      state.todoList.forEach(e => {
        e.isComplete = payload
      });
      saveLocalStorage(state.todoList)
    },
    clearTodo(state) {
      const newArr = state.todoList.filter(e => e.isComplete === false)
      state.todoList = newArr
      saveLocalStorage(state.todoList)
    },
    checkItem(state, index) {
      state.todoList[index].isComplete = !state.todoList[index].isComplete
      saveLocalStorage(state.todoList)
    }
  },
  actions: {

  },
  modules: {
  }
})

function saveLocalStorage(data) {
  localStorage.setItem("todo-list-v2", JSON.stringify(data));
}