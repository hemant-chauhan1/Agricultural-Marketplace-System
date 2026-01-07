import { Container, Flex, HStack, Text, Button, useColorMode, useColorModeValue,Box, flexbox } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { PlusSquareIcon } from "@chakra-ui/icons"
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";
import { RiAccountCircleLine } from "react-icons/ri";
import { useAuthStore } from '../store/authStore';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input
} from '@chakra-ui/react'
import { useCartStore } from '../store/cart';


const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = React.useRef()
  const { isAuthenticated, logout, user, deleteAcc } = useAuthStore();
  const {cart} = useCartStore();
  
  const handleLogout = () => {
    logout();
  }
  const handleDelete = (event) => {
    event.preventDefault();
    deleteAcc(user.email);
  }

  return <Container maxWidth={"1140px"}>
    <Flex
      h={16}
      alignItems={"center"}
      justifyContent={"space-between"}
      flexDir={
        {
          base: "column",
          sm: "row"
        }
      }>
      <Text
        fontSize={{ base: "22", sm: "28" }}
        fontWeight={"bold"}
        textTransform={"uppercase"}
        textAlign={"center"}
        bgGradient={"linear(to-r, cyan.400,blue.500)"}
        bgClip={"text"}
      >
        <Link to={"/"}> Farm-Flo <span style={{ color: 'green' }}>🍃</span></Link>
      </Text>
      <HStack spacing={2} alignItems={"center"}>
        console.log(user.isAuthenticated)
        {isAuthenticated && (
          user?.accountType !== "seller" ? (
            <Link to={"/cart"}>
              <Button>
                <FaCartPlus fontSize={20} />
                <span style={{ position: "relative", top: "-10px" }}></span>
              </Button>
            </Link>
          ) : (
            <Link to={"/create"}>
              <Button>
                <PlusSquareIcon fontSize={20} />
              </Button>
            </Link>
          )
        )}
        <Button onClick={toggleColorMode}>
          {colorMode == "light" ? <IoMoon /> : <LuSun size="20" />}
        </Button>
        
        <Button
          ref={btnRef}
          colorScheme="black"
          onClick={onOpen} ml={10}
          _hover={{ colorMode: "gray.200" }}
          _active={{ bg: "none" }}
          bg={"transparent"}
        >
          <RiAccountCircleLine fontSize={38} color={colorMode === "dark" ? "white" : "black"} />
        </Button>
        <Text fontWeight={"bolder"}>{user?.name}</Text>

      </HStack>
    </Flex>
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {user ? <>{user.name}</> : <>Login</>}
        </DrawerHeader>

        <DrawerBody>

        </DrawerBody>

        <DrawerFooter >
          {isAuthenticated ? (
            <Box >
              <Button colorScheme="red" onClick={handleDelete} marginRight={10} >
                Delete
              </Button>

              <Button colorScheme="red" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            <>
              <Link to={"/register"}>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Register
                </Button>
              </Link>
              <Link to={"/login"}>
                <Button colorScheme="blue" onClick={onClose} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white" >
                  Login
                </Button>
              </Link>
            </>
          )}
        </DrawerFooter>

      </DrawerContent>

    </Drawer>
  </Container>

}

export default NavBar