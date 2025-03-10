import { LoginForm } from "@/components/form/login-form";
import React from "react";

const page = () => {
  const fetchdata = async () => {
    const data = await fetch("/api/member/nidzammst");
    const response = await data.json();

    console.log(response);

    return response;
  };
  fetchdata();

  return (
    <div className="container flex h-screen w-screen mx-auto my-auto">
      <LoginForm />;
    </div>
  );
};

export default page;
