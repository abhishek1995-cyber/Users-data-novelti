import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function Create() {
  const navigate = useNavigate();
  const [searchCountry, setSearchCountry] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenState, setIsOpenState] = useState(false);
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [countryCca, setCountryCca] = useState("");
  const [searchState, setSearchState] = useState("");
  const [state, setState] = useState([]);
  const [showState, setShowState] = useState([]);
  const [stateIso, setStateIso] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [city, setCity] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [showCity, setShowCity] = useState([]);
  const [errFirstname, setErrFirstname] = useState("");
  const [errLastName, setErrLastName] = useState("");
  const [errMobile, setErrMobile] = useState("");
  const [errZipCode, setErrZipCode] = useState("");

  const [inputValue, setInputValue] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    zipcode: "",
  });

  // fetching data using id for edit

  const [searchParams] = useSearchParams();
  var id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      const fetchDataById = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/users/${id}/edit`
          );
          setInputValue(response.data.user);
          setSearchCity(response.data.user.city);
          setSearchState(response.data.user.city);
          setSearchCountry(response.data.user.country);
        } catch (error) {
          console.error(error);
        }
      };
      fetchDataById();
    }
  }, [id]);

  // fetching country data from api

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Perform search API call here for country search

      fetch(`https://restcountries.com/v3.1/name/${searchCountry}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data))
        .catch((error) => console.error(error));

      console.log("Searching for:", searchCountry);
    }, 700);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [searchCountry]);

  useEffect(() => {
    var headers = new Headers();
    console.log("one");
    headers.append(
      "X-CSCAPI-KEY",
      "RlZqMTM5NmhhbEF5cnJaNjRiNlZvRVRWWmFmR3kyVnkyN2JMc0lENQ=="
    );

    var requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    // fetching state data
    if (countryCca) {
      const fetchCountry = async () => {
        try {
          const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${countryCca}/states`,
            requestOptions
          );
          const data = await response.json();
          setState(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchCountry();
    }
    // fetching city data

    if (stateIso) {
      const fetchState = async () => {
        try {
          const res = await fetch(
            `https://api.countrystatecity.in/v1/countries/${countryCca}/states/${stateIso}/cities`,
            requestOptions
          );
          const cityData = await res.json();
          setCity(cityData);
        } catch (error) {
          console.log(error);
        }
      };
      fetchState();
    }
    console.log("two");
  }, [countryCca, stateIso]);

  console.log(countryCca, "countryCca");
  console.log(stateIso, "stateIso");

  //  handling input change

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchChange = (event) => {
    setIsOpen(true);
    setSearchCountry(event.target.value);
  };

  const handleCountry = (code, name) => {
    setCountryCca(code);
    setSearchCountry(name);
    setIsOpen(!isOpen);
  };

  const handleSearchState = (e) => {
    setIsOpenState(true);
    setSearchState(e.target.value);
    const filteredState = state.filter((ele, i) =>
      ele?.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setShowState(filteredState);
  };

  const handleClickState = (name, code) => {
    setStateIso(code);
    setSearchState(name);
    setIsOpenState(!isOpenState);
  };
  const handleSearchCity = (e) => {
    setIsOpenCity(true);
    setSearchCity(e.target.value);
    const filteredCity = city.filter((ele) =>
      ele?.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setShowCity(filteredCity);
  };

  const handleClickCity = (name) => {
    setSearchCity(name);
    setIsOpenCity(!isOpenCity);
  };

  // handling submit request

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileNumber = inputValue.mobile.trim();
    const zip = inputValue.zipcode.trim();
    const regexMobile = /^[0-9]{10}$/;
    const regexzip = /^\d{6}$/;
    console.log(inputValue.firstname.trim().length < 5, "first name");

    if (inputValue.firstname.trim().length < 5) {
      setErrFirstname("Minimum 5 character");
      return;
    }

    if (inputValue.lastname.trim().length < 5) {
      setErrLastName("Minimum 5 character for lastname ");
      return;
    }
    if (!regexMobile.test(mobileNumber)) {
      setErrMobile("Enter a valid phone Number");
      return;
    }
    if (!regexzip.test(zip)) {
      setErrZipCode("Enter a valid zip code");
      return;
    }
    // alert("form submitted succesfully");

    // posting data to server;
    const { firstname, lastname, email, mobile, address1, address2, zipcode } =
      inputValue;

    const postData = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      mobile: mobile,
      address1: address1,
      address2: address2,
      zipcode: zipcode,
      city: searchCity,
      state: searchState,
      country: searchCountry,
      countrycode: countryCode[0],
    };

    try {
      if (id) {
        const res = await axios.put(
          `http://localhost:4000/api/users/${id}/edit`,
          postData
        );
        alert("Post updated successfully!");
        navigate("/");
      } else {
        const response = await axios.post(
          `http://localhost:4000/api/users`,
          postData
        );
        alert("Post created successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  var countryCode = [];

  if (searchResults.length > 0 && isOpen === false) {
    countryCode = searchResults.map(
      (ele) => ele?.idd?.root + ele?.idd?.suffixes[0]
    );
  }

  return (
    <div className="flex justify-center mt-32">
      <form
        className="  grid grid-cols-2 place-content-between max-w-2xl p-8 grid-flow-row gap-2 border border-gray-200 rounded-2xl bg-blue-200 "
        onSubmit={handleSubmit}
      >
        <label>
          FirstName:
          <input
            className="mb-2 px-4 py-2 border rounded block"
            onInput={handleChange}
            type="text"
            name="firstname"
            value={inputValue.firstname}
            placeholder="Your first name"
          />
          {errFirstname && <p>{errFirstname}</p>}
        </label>
        <label>
          LastName:
          <input
            className="block px-4 py-2 border rounded mb-2"
            onInput={handleChange}
            type="text"
            name="lastname"
            value={inputValue.lastname}
            placeholder="Your last name"
          />
          {errLastName && <p>{errLastName}</p>}
        </label>
        <label>
          Email:
          <input
            className="block px-4 py-2 border rounded mb-2"
            onInput={handleChange}
            type="text"
            name="email"
            value={inputValue.email}
            placeholder="Your email"
          />
        </label>
        <label>
          Mobile:
          <div>
            <input
              className=" px-4 w-20 py-2 border rounded "
              type="text"
              defaultValue={countryCode[0]}
              placeholder="code"
              readOnly
            />
            <input
              className=" px-4 py-2 border rounded mb-2"
              onInput={handleChange}
              type="text"
              name="mobile"
              value={inputValue.mobile}
              placeholder="Your mobile"
            />
            {errMobile && <p>{errMobile}</p>}
          </div>
        </label>
        <label>
          Address 1:
          <input
            className="block px-4 py-2 border rounded mb-2"
            onInput={handleChange}
            type="text"
            name="address1"
            value={inputValue.address1}
            placeholder="Your address"
            required
          />
        </label>
        <label>
          Address 2:
          <input
            className="block px-4 py-2 border rounded mb-2"
            onInput={handleChange}
            type="text"
            name="address2"
            value={inputValue.address2}
            placeholder="Your address"
          />
        </label>
        <label>
          City:
          <input
            className="block px-4 py-2 border rounded mb-2"
            onChange={handleSearchCity}
            type="text"
            name="city"
            value={searchCity}
            placeholder="Your city"
          />
          <ul
            className={
              isOpenCity
                ? "overflow-scroll  w-full max-h-60 bg-white flex-col rounded-2xl flex"
                : ""
            }
          >
            {searchCity.length > 0 &&
              showCity.length > 0 &&
              isOpenCity &&
              showCity.map((result, i) => (
                <div
                  className="py-1 pl-3  hover:bg-teal-500 cursor-pointer"
                  key={i}
                  onClick={(e) => handleClickCity(result?.name)}
                >
                  {result.name}
                </div>
              ))}
          </ul>
        </label>
        <label>
          State:
          <input
            className="block px-4 py-2 border rounded mb-2"
            onInput={handleSearchState}
            type="text"
            name="state"
            value={searchState}
            placeholder="Your state"
          />
          <ul
            className={
              isOpenState
                ? "overflow-scroll  w-full max-h-60 bg-white flex-col rounded-2xl flex"
                : ""
            }
          >
            {searchState.length > 0 &&
              showState.length > 0 &&
              isOpenState &&
              showState.map((result, i) => (
                <div
                  className="py-1 pl-3  hover:bg-teal-500 cursor-pointer"
                  key={i}
                  onClick={(e) => handleClickState(result?.name, result?.iso2)}
                >
                  {result.name}
                </div>
              ))}
          </ul>
        </label>
        <label>
          Country:
          <input
            className=" block px-4 py-2 border rounded mb-2"
            onChange={handleSearchChange}
            type="text"
            name="country"
            value={searchCountry}
            placeholder="Your country"
          />
          <ul
            className={
              isOpen
                ? "overflow-scroll  w-full max-h-60 bg-white flex-col rounded-2xl flex"
                : ""
            }
          >
            {searchResults.length > 0 &&
              isOpen &&
              searchResults.map((result, i) => (
                <div
                  className="py-1 pl-3  hover:bg-teal-500 cursor-pointer"
                  key={i}
                  onClick={(e) =>
                    handleCountry(result?.cca2, result?.name?.common)
                  }
                >
                  {result?.name?.common}
                </div>
              ))}
          </ul>
        </label>
        <label>
          Zipcode:
          <input
            className="block px-4 py-2 border rounded mb-2"
            onInput={handleChange}
            type="text"
            name="zipcode"
            value={inputValue.zipcode}
            placeholder="Your zipcode"
          />
          {errZipCode && <p>{errZipCode}</p>}
        </label>
        <button
          className="inline-block my-3 ml-32 px-5 py-4 w-full text-white text-center font-semibold tracking-tight bg-indigo-500 hover:bg-indigo-600 rounded-lg focus:ring-4 focus:ring-indigo-300 transition duration-200"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
