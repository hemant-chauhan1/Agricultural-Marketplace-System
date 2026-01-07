import React, { useEffect } from 'react'
import { Container, VStack, Text, SimpleGrid } from "@chakra-ui/react"
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/product'
import ProductCart from '../components/ProductCart'
const HomePage = () => {

  const { fetchProducts, products } = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return <Container maxW="container.xl" py={12}>
    <VStack spacing={8}>
      <Text
        fontSize={30}
        fontWeight={"bold"}
        bgGradient={"linear(to-r,cyan.400,blue.500)"}
        bgClip={"text"}
        textAlign={"center"}>
        List of All the Produces
      </Text>

      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
          lg: 3
        }}
        spacing={10}
        width={"full"}>
        {products.map((product) => (
          <ProductCart key={product._id} product={product} />
        ))}
      </SimpleGrid>

      {products.length === 0 && (<Text fontSize={"xl"} textAlign={"center"} fontWeight={"bold"} color={"gray.500"}>
        No Products Listed! {" "}
        <Link to={"/create"}>
          <Text as='span' color={"blue.500"} fontWeight={"bold"} _hover={{ textDecoration: "underline" }}>
            Create new Product
          </Text>
        </Link>
      </Text>)}


    </VStack>

  </Container>
}

export default HomePage