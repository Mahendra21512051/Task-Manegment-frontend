import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  tasks: [],
  taskToEdit: null, 
};
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload; 
      console.log("setTasks [state.tasks]",state.tasks)
    },
    addTask: (state, action) => {
      state.tasks = [action.payload, ...state.tasks]; 
    },
    setTaskToEdit: (state, action) => {
      state.taskToEdit = action.payload;
    },
    updateTask: (state, action) => {
      state.tasks = state.tasks.map((task) =>
        task._id === action.payload._id ? action.payload : task
      );
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
  },
});
export const { setTasks, setTaskToEdit, updateTask, deleteTask, addTask } =
  taskSlice.actions;
export default taskSlice.reducer;
