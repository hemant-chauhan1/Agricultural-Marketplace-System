import { Container,Box ,Heading, VStack, Input,useColorModeValue, Button } from '@chakra-ui/react'
import React from 'react'

const BillingAddress = () => {
    
  return (
    
    <Container>
        <Heading mt={5} textAlign={"center"}>Fill your Details</Heading >
            <Box  w={"full"} bg={useColorModeValue("white", "gray.800")}
                rounded={"lg"} p={6} shadow={"md"} mt={"20"}>   
                <VStack>
                    <form>
                    <Input placeholder='Enter Your name'  marginBottom={"15px"}/>
                    <Input placeholder='Enter Your contact Number'  marginBottom={"15px"}/>
                    <Input placeholder='Pin Code' marginBottom={"15px"}/>
                    <Input placeholder='Enter Your full address' marginBottom={"15px"}/>
                    <Input placeholder='City' marginBottom={"15px"}/>
                    <Input placeholder='District' marginBottom={"15px"}/>
                    <Input placeholder='State' marginBottom={"15px"}/>

                    </form>
                    <Button>Proceed for Payment</Button>
                </VStack>
            </Box>
    </Container>
  )
}

export default BillingAddress