import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard(props) {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users"); // Replace with your endpoint
        setUserData(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${itemId}`);
      // Remove the deleted item from the component state
      setUserData((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav>
        <ul className="flex justify-between bg-blue-300 p-8 text-3xl font-bold">
          <Link to={"/"}>Home</Link>
          <Link to={"/create"}>Create User</Link>
        </ul>
      </nav>
      <div className="p-8 flex justify-evenly">
        {userData.length > 0 &&
          userData.map((result, i) => (
            <div className="bg-gray-400 grid w-1/4 p-8">
              <p key={i}>
                Fullname: {result?.firstname + " " + result?.lastname}
              </p>
              <p key={i}>Email: {result?.email}</p>
              <p key={i}>Contact: {result?.countrycode + result?.mobile} </p>
              <p key={i}>
                Address: {result?.address1 + " " + result?.address2}
              </p>
              <p key={i}>Zipcode: {result?.zipcode}</p>
              <p key={i}>City: {result?.city}</p>
              <p key={i}>State: {result?.state}</p>
              <p key={i}>Country: {result?.country}</p>
              <Link
                className="  my-3   py-4 w-full text-white text-center font-semibold tracking-tight bg-indigo-500 hover:bg-indigo-600 rounded-lg focus:ring-4 focus:ring-indigo-300 transition duration-200"
                to={`/create?id=${result?._id}`}
              >
                Edit
              </Link>

              <button
                className="  my-3   py-4 w-full text-white text-center font-semibold tracking-tight bg-indigo-500 hover:bg-indigo-600 rounded-lg focus:ring-4 focus:ring-indigo-300 transition duration-200"
                onClick={(e) => handleDelete(result?._id)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
