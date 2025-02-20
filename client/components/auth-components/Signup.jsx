import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
/**
 * imports for redux
 */
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../../features/auth/authSlice";
// import axios from "axios";

import bg from "../../../styles/bg-photo3.jpeg";

import SignupForm from "./SignupForm";
import { GiLightBackpack } from "react-icons/gi";
import list from "../data/list";

const Signup = () => {
  const { user, user_id } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [interests, setInterests] = useState(new Set());
  const [activities, setActivities] = useState(list);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  // useEffect(() => {
  //   //if there is an error we want to send an error message
  //   if (isError) alert(message);
  //   dispatch(reset());
  //   // if sign up is successful (re: stgate updating) we want to send them on their way to dashboard
  //   if (isSuccess || user) {
  //     navigate("/app/dashboard");
  //   }
  //   dispatch(reset());
  // }, [user, isError, isSuccess, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myInterests = Array.from(interests);
    const userInfo = {
      name: name,
      email: email,
      password: password,
      zipCode: zipcode,
      interests: myInterests,
      bio: bio,
    };

    const zipCodeRegex = /^\d{5}(?:-\d{4})?$/;

    if (!zipcode || !bio) {
      setError("All fields are required");
      return;
    }

    if (!zipCodeRegex.test(zipcode)) {
      setError("Invalid zipcode");
      setZipcode("");
      return;
    }

    //updated by Julia
    dispatch(register(userInfo))
      .unwrap()
      .then(() => {
        navigate("/app/imageupload");
      })
      .catch((error) => {
        console.error(error);
      });

    // try {
    //   // const res = await axios.post("/api/signup", userInfo);
    //   // navigate("/imageupload", { state: { email: email } });
    //   return;
    // } catch (err) {
    //   setError(err);
    //   return;
    // }
  };

  const removeInterest = (e) => {
    e.preventDefault();

    const interest = e.target.parentElement.getAttribute("interest");
    const tempInt = new Set(interests);
    tempInt.delete(interest);
    setInterests(tempInt);

    const removedInterest = list.find((item) => item.value === interest);

    const interestObject = {
      label: interest,
      value: interest,
      icon: removedInterest.icon,
    };

    const updatedActivities = activities.concat(interestObject);
    setActivities(
      updatedActivities.sort((a, b) => a.label.localeCompare(b.label))
    );
  };

  return (
    <div className="flex justify-center items-center h-screen w-full p-10 bg-black/70">
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          shadow-2xl
          rounded-xl
          h-full 
          bg-cover 
          bg-center
          w-full
          text-zinc-200
        "
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div
          className="
            md:bg-black/50 
            bg-black/50 
            w-full 
            h-full 
            flex 
            shadow-xl
            flex-col
            items-end
            md:pr-20 
            justify-center 
            rounded-xl
          "
        >
          <div className="flex flex-col mb-36 absolute top-12 left-12">
            <div className="flex items-center gap-2">
              <h1
                className="
                  text-3xl
                  flex
                  gap-2
                  md:text-4xl
                  font-bold
                  px-8
                  mt-8
                  rounded-full
                  pointer-events-none
              "
              >
                Adventure Connect
                <GiLightBackpack className="text-blue-500" size={40} />
              </h1>
            </div>
            <h2 className="text-zinc-400 text-sm px-8 pointer-events-none">
              Find Friends Outdoors
            </h2>
          </div>
          <SignupForm
            setActivities={setActivities}
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            zipcode={zipcode}
            setZipcode={setZipcode}
            interests={interests}
            setInterests={setInterests}
            removeInterest={removeInterest}
            handleSubmit={handleSubmit}
            activities={activities}
            list={list}
            bio={bio}
            setBio={setBio}
            error={error}
            setError={setError}
          />
          <div className="flex gap-2 pt-4 pr-28 md:pr-48">
            <div className="pointer-events-none">Already have an account?</div>
            <span
              className="
                text-blue-500 
                hover:text-blue-600 
                hover:transform
                hover:transition-all
                hover:scale-110
                cursor-pointer"
              onClick={() => navigate("/")}
            >
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
