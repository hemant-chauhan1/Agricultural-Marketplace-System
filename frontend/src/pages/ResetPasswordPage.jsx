import React, { useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import {Container ,Box,Text,useColorModeValue,Input,Button} from "@chakra-ui/react"
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
    const[pass, setPass] = useState("");
    const[pass2, setPass2] = useState("");
	const { isLoading, error,resetPassword,message } = useAuthStore();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) =>{
        const {name, value} = e.target
        if(name ==="pass"){

            setPass(e.value);
        }
        if(name == "passVerify"){
            setPass2(e.value)
        }
    }
    const handleReset = async() =>{
        e.preventDefault();

		if (pass !== pass2) {
			alert("Passwords do not match");
			return;
		}
		try {
			await resetPassword(pass, token);
            console.log("reset done!")
			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
    }
  return (
    <Container >
        <Box  w={"full"} bg={useColorModeValue("white", "gray.800")}
                rounded={"lg"} p={6} shadow={"md"} mt={"20"} textAlign={"center"}>
           
                <Text fontSize="3xl"  className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>Reset Password</Text>
                <form onSubmit={handleReset}>
                        <Input
                            placeholder='Enter your new password'
                            type='password'
                            name='pass'
                            value={pass}
                            onChange={handleChange}
                            marginBottom={"15px"}
                        />

                        <Input
                            placeholder="Re-Enter your new password"
                            name='passVerify'
                            type='password'
                            value={pass2}
                            onChange={handleChange}
                            marginBottom={"15px"}
                        />
                        {error && <p style={{ color: "red" }}>{error}</p>}
                      
                        <motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full my-5 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Reset"}
						</motion.button>
                       
                    </form>
        </Box>
    </Container>
  )
}

export default ResetPasswordPage