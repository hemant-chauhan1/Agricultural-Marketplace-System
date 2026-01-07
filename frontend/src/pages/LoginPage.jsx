import { Container, Heading, VStack, Input, Button, HStack, Box, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import { useAuthStore } from '../store/authStore'
import { Loader } from 'lucide-react'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signin, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name == "email") {
            setEmail(value);
        }
        if (name == "password") {
            setPassword(value);
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await signin(email, password);
            if (response) {
                navigate("/")
            }
        } catch (error) {
            console.log("error is: ", error)
        }
    }
    return (
        <Container>
            <Box
                w={"full"} bg={useColorModeValue("white", "gray.800")}
                rounded={"lg"} p={6} shadow={"md"} mt={"20"} >
                <VStack gap={3}  >
                    <Heading as={"h1"} mb={10} className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        Please Login!
                    </Heading >
                    <form onSubmit={handleLogin}>
                        <Input
                            placeholder='Enter the email of Phone number'
                            type='text'
                            name='email'
                            value={email}
                            onChange={handleChange}
                            marginBottom={"15px"}
                        />

                        <Input
                            placeholder="Enter your password"
                            name='password'
                            type='password'
                            value={password}
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
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Login"}
						</motion.button>
                        <Link to={"/forgot-password"} >
                            <Text color={useColorModeValue("#6C757D", "#8A8A8A")}
                                _hover={{
                                    color: useColorModeValue("#0056D2", "#66B2FF"),
                                    textDecoration: "underline",
                                }} >
                                Forgot Password?
                            </Text>
                        </Link>

                            <div>
                                Don't have an account?
                                <Link to={"/register"} style={{ color: "gray" }} >
                                    &nbsp; Register
                                </Link>
                            </div>
                    </form>
                </VStack>
            </Box>
        </Container>
    )
}

export default LoginPage