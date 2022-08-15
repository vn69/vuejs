<template>
  <div class="todo-app">
    <h1>Todo App</h1>
    <div class="todo-app__add">
      <label for="todoLabel">Todo: </label>
      <input ref="inputElement" class="input" type="text" id="todoLabel" name="todoLabel" 
        v-model="todoName"
        @keypress.enter="handleChangeItem"
        >
      <button @click="handleChangeItem" :disabled="notShowAddBtn">{{mode === "add" ? "Add" : "Edit"}}</button>
    </div>
    <ul class="list">
      <li class="list__item" v-for="(item, index) in todoList" :key="index">
        <input type="checkbox" v-model="item.isComplete"/>
        <span :class="['list__item-name', item.isComplete?'done':'']" @click="checkItem(item)">{{index + 1 + ": " +item.name}}</span>
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
export default {
  data() {
    return {
      showClearButton: false,
      mode: "add",
      indexItemEdit: -1,
      todoName: "",
      todoList: localStorage.getItem("todo-list") ? JSON.parse(localStorage.getItem("todo-list")) : []
    }
  },
  watch: {
    todoList: {
      handler(newValue) {
        this.showClearButton = this.checkShowClearButton()
      },
      deep: true
    }
  },
  computed: {
    notShowAddBtn() {
      const nameResult = this.todoName.trim()
      return !nameResult
    }
  },
  created() {
    this.showClearButton = this.checkShowClearButton()
  },
  methods:{
    handleChangeItem() {
      this.todoName.trim()
      const nameResult = this.todoName.trim()
      if(nameResult) {
        if(this.mode === "add") {
          this.todoList.push({name: nameResult, isComplete: false})
        } else {
          if (this.indexItemEdit > -1) {
            this.todoList.splice(this.indexItemEdit, 1, {name: nameResult, isComplete: false})
            this.indexItemEdit = -1
            this.mode = "add"
            console.log(this.todoList)
          }
        }
      } 
      this.todoName = ""
      this.$refs.inputElement.focus()
      this.saveLocalStorage()
    },
    deleteItem(index) {
      this.todoList.splice(index,1)
      this.saveLocalStorage()

    },
    editItemIndex(item, index) {
      this.todoName = item.name
      this.indexItemEdit = index
      this.mode = "edit"
      this.$refs.inputElement.focus()
    },
    checkAll(e) {
      const isCheckAll = e.target.checked
      this.todoList.forEach(e => {
        e.isComplete = isCheckAll
      });
      this.saveLocalStorage()
    },
    clearTodo() {
      const newArr =  this.todoList.filter(e => {
        return e.isComplete == false
      });
      this.todoList = newArr
      this.saveLocalStorage()
    },
    checkItem(item) {
      item.isComplete = !item.isComplete
      this.saveLocalStorage()
    },
    saveLocalStorage() {
      localStorage.setItem("todo-list", JSON.stringify(this.todoList));
    },
    checkShowClearButton() {
      const index =  this.todoList.findIndex(e => e.isComplete)
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