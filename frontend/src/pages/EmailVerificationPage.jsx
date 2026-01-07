import React, { useState } from 'react'
import { HStack, PinInput, PinInputField, Container, Box, useColorModeValue, Heading, Button } from '@chakra-ui/react';
import { useAuthStore } from "../store/authStore";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"

const EmailVerificationPage = () => {
  const [code, setCode]  = useState("");
const navigate = useNavigate();
  const {verifyEmail,error,isLoading} = useAuthStore();

  const handleChange = (value) =>{
    setCode(value);
  }
  
  const handleSubmit = async (e) =>{
    e.preventDefault()
    console.log(code)
      try {
          await verifyEmail(code);
          toast.success("successfully verified!")
          navigate("/");
      } catch (error) {
        console.log("error while submitting the code:",error);
      }
  }
  return (
    <Container style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>

      <Box
        w={"full"} bg={useColorModeValue("white", "gray.800")}
        rounded={"lg"} p={20} shadow={"md"} mt={"10"} display={"flex"} flexDir={"column"} alignItems={"center"}>

      <Heading fontSize={20} mb={5}>Verify Your Email!</Heading>
        <HStack gap={5} mb={5}>
          <PinInput onChange={handleChange}>
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
      {error && <p>{error}</p>}
        <Button onClick={handleSubmit} >{isLoading ? "Loading...":"Submit"}</Button>
      </Box>
    </Container>
  );
};

export default EmailVerificationPage



{/* <div>
<h2 className='text-slate-800'>Enter the code sent to your email</h2>
<HStack>
  <PinInput>
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
  </PinInput>
</HStack>
</div> */}


// style={{height:"100vh",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}