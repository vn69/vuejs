<template>
  <div class="todo-app">
    <h1>Todo App (vuex) {{title}}</h1>
    <div class="todo-app__add">
      <label for="todoLabel">Todo: </label>
      <input ref="inputElement" class="input" type="text" id="todoLabel" name="todoLabel" 
        v-model="todoName"
        @keypress.enter="handleChangeItem"
        >
      <button @click="handleChangeItem" :disabled="notShowAddBtn">{{mode === "add" ? "Add" : "Edit"}}</button>
    </div>
    <ul class="list">
      <li class="list__item" v-for="(item, index) in getTodoList" :key="index">
        <input type="checkbox" v-model="item.isComplete"/>
        <span :class="['list__item-name', item.isComplete?'done':'']" @click="$store.commit('checkItem',index)">{{index + 1 + ": " +item.name}}</span>
        <button @click="editItemIndex(item, index, index)">edit</button>
        <button class="ml-10" @click="deleteItem(index)">delete</button>
      </li>
    </ul>
    <input type="checkbox" id="allCheck" @click="checkAll"/>
    <label for="allCheck">All</label>
    <button class="ml-10" @click="clearTodo" :disabled="!showClearButton">Clear</button>

  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex"

export default {
  props: ["title"],
  data() {
    return {
      showClearButton: false,
      mode: "add",
      indexItemEdit: -1,
      todoName: "",
      todoList: localStorage.getItem("todo-list") ? JSON.parse(localStorage.getItem("todo-list")) : []
    }
  },
  created() {
    this.showClearButton = this.checkShowClearButton()
  },
  computed: {
    ...mapGetters(["getTodoList"]),
    notShowAddBtn() {
      const nameResult = this.todoName.trim()
      return !nameResult
    }
  },
  watch: {
    getTodoList: {
      handler(newValue) {
        this.showClearButton = this.checkShowClearButton()
      },
      deep: true
    }
  },
  methods:{
    ...mapMutations(["addItem","deleteItem","checkAll","clearTodo","editItem"]),
    handleChangeItem() {
      const nameResult = this.todoName.trim()
      if(nameResult) {
        if(this.mode === "add") {
          const newItem = {name: nameResult, isComplete: false}
          this.$store.commit("addItem", newItem )
        } else {
          if (this.indexItemEdit > -1) {
            this.$store.commit("editItem", {index: this.indexItemEdit, data: {name: nameResult, isComplete: false}})

            this.indexItemEdit = -1
            this.mode = "add"
          }
        }
      } 
      this.todoName = ""
      this.$refs.inputElement.focus()
    },
    deleteItem(index) {
      this.$store.commit("deleteItem", index)
    },
    editItemIndex(item, index) {
      this.todoName = item.name
      this.indexItemEdit = index
      this.mode = "edit"
      this.$refs.inputElement.focus()
    },
    checkAll(e) {
      const isCheckAll = e.target.checked
      this.$store.commit("checkAll", isCheckAll)
    },
    clearTodo() {
      this.$store.commit("clearTodo")
    },
    checkShowClearButton() {
      const index =  this.getTodoList.findIndex(e => e.isComplete)
      if (index > -1) {
        return true
      }
      return false
    }
  }
}
</script>

<style>
button {
  padding: 8px;
  cursor: pointer;
}
ul {
  list-style: none;
  margin: 0;
  padding: 10px 0;
}
.todo-app {
  font-size: 18px;
  max-width: 400px;
}
.todo-app__add {
  display: flex;
  align-items: center;
}
.input {
  padding: 8px;
  width: 300px;
  outline: none;
}
.list__item {
  padding: 6px 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.list__item:hover {
  background-color: #aaa;
}
.list__item-name {
  flex-grow: 1;
  margin-left: 5px;
}
.list__item-name.done {
  text-decoration: line-through;
  color: #777
}
.ml-10 {
  margin-left: 10px;
}
</style>