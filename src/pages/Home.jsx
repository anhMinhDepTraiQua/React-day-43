import {  useEffect } from "react";
import { useMeQuery } from "../services/auth";
import { Navigate } from "react-router-dom";
export default function Home() {
  const currentUser = useMeQuery();
  console.log(currentUser);
  if(currentUser.isError){
    return <Navigate to="/login"/>
  }
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  )
}