import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Heading, HStack, VStack, Box, Container, useColorModeValue } from '@chakra-ui/react';
import { motion } from "framer-motion"
import { useAuthStore } from '../store/authStore';
import { Loader } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("user"); // New state for account type
    const { signup, error, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, name, accountType);  // Pass accountType as parameter
            navigate("/verify-email");
        } catch (error) {
            console.log("error in signing up", error);
        }
    };

    return (
        <Container>
            <Box
                w={"full"} bg={useColorModeValue("white", "gray.800")}
                rounded={"lg"} p={6} shadow={"md"} mt={"20"}>
                <VStack gap={3}>
                    <Heading as={"h1"} mb={10} className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>Create an Account</Heading>

                    <form onSubmit={handleSubmit}>
                        <Input
                            placeholder='Enter first name'
                            type='text'
                            name='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            marginBottom={"15px"}
                        />
                        <Input
                            placeholder="Enter your email"
                            name='email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            marginBottom={"15px"}
                        />
                        <Input
                            placeholder="Enter your password"
                            name='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            marginBottom={"15px"}
                        />

                        <select
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            style={{ marginBottom: '15px', padding: '8px', borderRadius: '4px' }}
                        >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                        </select>

                        {error && <p style={{ color: "red" }}> {error} </p>}
                        <motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full my-3 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
                           
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Register"}
						</motion.button>
                            <div>Already have an account?
                                <Link to={"/login"} style={{ color: "gray" }}>
                                    &nbsp;Login
                                </Link>
                            </div>
                      
                    </form>
                </VStack>
            </Box>
        </Container>
    );
};

export default RegisterPage;
