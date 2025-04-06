import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import confirmDialog from "../utils/ConfirmDialog";
import { formatDistanceToNow } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { setTasks, setTaskToEdit, deleteTask } from "../store/taskSlice";
import Swal from "sweetalert2";
import FriendsImage from "../assets/friend.png";

const TaskList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(null); // Track menu per task


  useEffect(() => {
    if (!user) {
      dispatch(setTasks([]));
      return;
    }
    if (!user.id) {
      navigate("/");
      return;
    }
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/Clustertaskmanagment/Taskmanegment/alldata?UserId=${user.id}`
        );
        dispatch(setTasks(response.data.tasks));
      } catch (error) {
        Swal.fire("Error", "Failed to load tasks: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, dispatch, navigate]);

  const DeleteTask = async (task) => {
    const result = await confirmDialog("Are you sure?", "warning");
    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/Clustertaskmanagment/Taskmanegment/${task._id}`
        );
        dispatch(deleteTask(task._id));
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the task: " + error.message, "error");
      }
    }
  };

  const editTask = (task) => {
    navigate(`/edittask/${task._id}`);
  };

  const addNewTask = () => {
    dispatch(setTaskToEdit(null));
    navigate("/addnewtask");
  };
  const setHideMenu= ()=>{
    if(showMenu !== null){
       setShowMenu(null);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-extrabold text-gray-700">Task List</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={addNewTask}
          >
            + Add Task
          </button>
        </div>
        {loading ? (
          <p className="text-gray-500 text-center">Loading tasks...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
              <thead className="bg-gray-200">
                <tr className="text-left">
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">SN</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Date</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Owner</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Category</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Task</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Status</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((t, index) => (
                    <tr key={t._id || index} className="hover:bg-gray-100 text-gray-700"  onClick={() => setHideMenu()}>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                        {t.createdAt ? `${formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}` : "N/A"}
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-left">{t.CreatedBy || "Unknown"}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-left">{t.Category || "Unknown"}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-left flex items-center space-x-2">
                        <span>{t.Task}</span>
                        {(t.isShared || t.sharedWithOthers) && (
                          <img
                            className="w-5 md:w-6 h-5 md:h-6 cursor-pointer hover:scale-110"
                            src={FriendsImage}
                            alt="Shared Task"
                          />
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">{t.Status}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center relative">
                        <div className="flex items-center justify-center">
                          <button onClick={() => setShowMenu(showMenu === t._id ? null : t._id)} className="relative">
                            <BsThreeDotsVertical className="w-6 h-6 cursor-pointer hover:scale-110" />
                          </button>
                        </div>



                        {showMenu === t._id && (
                          <div id='acton_cards' className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            <ul className="py-2 text-left">
                              {(!t.isShared || t.Permission === "edit") && (
                                <li
                                  onClick={() => editTask(t)}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  ✏️ Edit
                                </li>
                              )}
                              {!t.isShared && (
                                <li
                                  onClick={() => DeleteTask(t)}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  🗑️ Delete
                                </li>
                              )}
                              {t.sharedWithOthers && <li className="px-4 py-2 hover:bg-gray-100">🔗 Shared with Others</li>}
                              {t.isShared && <li className="px-4 py-2 hover:bg-gray-100">📩 Received Task</li>}
                              {t.Permission === "View" && <li className="px-4 py-2 hover:bg-gray-100">👀 View Task</li>}
                              {t.Permission === "comment" && <li className="px-4 py-2 hover:bg-gray-100">💬 Comment</li>}
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="border border-gray-300 px-4 py-2 text-center text-gray-500">No tasks added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
