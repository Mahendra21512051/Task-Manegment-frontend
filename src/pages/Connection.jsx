import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";

const Connection = () => {
  const navigate=useNavigate();
   
  
  useEffect(() => {
     setTimeout(() => {
      navigate("/connection/allConnection");
    });
  }, []); 

  return (
    <div>
      {/* Header Section with Navigation */}
      <header className="bg-white p-4 flex justify-around gap-4 border-b">
        <Link
          to="allConnection"
          className="border border-gray-400 px-4 py-2 text-black rounded-lg hover:bg-gray-100 transition"
        >
          All User
        </Link>
        
        <Link
          to="seandingConnection"
          className="border border-gray-400 px-4 py-2 text-black rounded-lg hover:bg-gray-100 transition"
        >
          Sending Requests
        </Link>
        <Link
          to="recivedConnection"
          className="border border-gray-400 px-4 py-2 text-black rounded-lg hover:bg-gray-100 transition"
        >
        Received Requests
        </Link>
        <Link
          to="friends"
          className="border border-gray-400 px-4 py-2 text-black rounded-lg hover:bg-gray-100 transition"
        >
          Friends
        </Link>
      </header>

      {/* Outlet to Load Pages */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Connection;
