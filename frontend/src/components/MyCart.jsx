// import React, { useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Heading,
//   Text,
//   Stack,
//   Divider,
//   VStack,
//   HStack,
//   Image,
//   useToast,
//   Spinner,
//   Center,
// } from '@chakra-ui/react';
// import { useCartStore } from '../store/cart';
// import { useNavigate } from 'react-router-dom'

// const Cart = ({ cart: initialCart }) => {
//   const { getCart, removeFromCart, clearCart, isLoading, error, cart } = useCartStore();
//   const toast = useToast();
// const navigate = useNavigate();
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       await getCart();
//     } catch (err) {
//       console.error('Error fetching cart:', err);
//       toast({
//         title: 'Error',
//         description: 'Failed to fetch cart.',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleRemoveCart = async (userId,productId) => {
    
//     try {
//       const {success,message} = await removeFromCart(userId,productId);
//  console.log(" frontedn success",success)
//       if(success){
//         toast({
//           title: 'Item Removed',
//           description: message,
//           status: 'info',
//           duration: 3000,
//           isClosable: true,
//         });
//       }
//       else{
//         toast({
//           title:"Error in removing product!",
//           description: message,
//           status:"info",
//           duration:3000,
//           isClosable:true,
//         })
//       }
//     } catch (err) {
//       console.error('Error removing item:', err);
//     }
//   };

//   const handleClearCart = async () => {
//     try {
//       await clearCart();
//       toast({
//         title: 'Cart Cleared',
//         description: 'All items have been removed from your cart.',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (err) {
//       console.error('Error clearing cart:', err);
//     }
//   };

//   const handleBuy = () =>{
//     navigate("/billing")
//   }

//   const cartData = cart || initialCart; // Fallback to props if cart is not in the store

//   if (isLoading) {
//     return (
//       <Box textAlign="center" mt={10}>
//         <Spinner size="xl" />
//         <Text mt={3}>Loading your cart...</Text>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box textAlign="center" mt={10}>
//         <Text color="red.500">Error: {error}</Text>
//       </Box>
//     );
//   }

//   if (!cartData || !cartData.items || cartData.items.length === 0) {
//     return (
//       <Box textAlign="center" mt={10}>
//         <Text>Your cart is empty. Start shopping!</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box p={5}>
//       <Heading mb={6} textAlign={"Center"}>My Cart</Heading>
//       <VStack spacing={4} align="stretch">
//         {cartData.items.map((item) => (
//           <Box
//           key={item.productId._id }
//           borderWidth="1px"
//           borderRadius="lg"
//           p={4}
//           shadow="md"
//           >
//             {console.log("item",item)}
//             <HStack spacing={4} display={"flex"} justify={"space-between"}>
//               <HStack spacing={10}>
//               <Image
//                 src={item.image || '/placeholder.png'} // Replace with your image URL property
//                 width={"250px"}
//                 height={"150px"}
//                 objectFit="cover"
//                 borderRadius="md"
//               />
//               <VStack align="start" spacing={2}>
//                 <Text fontWeight="bold">{item.productId.name}</Text>
//                 <Text>Quantity: {item.quantity}</Text>
//                 <Text>Price: Rs. {item.price}</Text>
//                 <Text>Total: Rs. {item.total}</Text>
//               </VStack>
//               </HStack>
//               <HStack>
              
//               <Button
//                 colorScheme="red"
                
//                 onClick={() => handleRemoveCart(item._id,item.productId.id)}
//               >
//                 Remove
//               </Button>
//               </HStack>
//             </HStack>
//           </Box>
//         ))}
//       </VStack>
//       <Divider my={6} />
//       <HStack justify="space-between">
//         <Heading size="lg">Subtotal: Rs. {cartData.subTotal}</Heading>
//         <Button colorScheme="green" onClick={handleBuy}>
//          Buy Now
//         </Button>
//         <Button colorScheme="red" onClick={handleClearCart}>
//           Clear Cart
//         </Button>
//       </HStack>
//     </Box>
//   );
// };

// export default Cart;





import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
  Image,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useCartStore } from '../store/cart';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { getCart, removeFromCart, clearCart, isLoading, error, cart } = useCartStore();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      await getCart();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to fetch cart.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveCart = async (cartItemId) => {
    try {
      const { success, message } = await removeFromCart(cartItemId);
      toast({
        title: success ? 'Item Removed' : 'Error',
        description: message,
        status: success ? 'info' : 'error',
        duration: 3000,
        isClosable: true,
      });
      if (success) fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast({
        title: 'Cart Cleared',
        description: 'All items have been removed from your cart.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuy = () => navigate("/billing");

  if (isLoading) return <Spinner size="xl" mt={10} display="block" mx="auto" />;
  if (error) return <Text color="red.500" textAlign="center" mt={10}>{error}</Text>;
  if (!cart?.items?.length) return <Text textAlign="center" mt={10}>Your cart is empty. Start shopping!</Text>;

  return (
    <Box p={5}>
      <Heading mb={6} textAlign="center">My Cart</Heading>
      <VStack spacing={4} align="stretch">
        {cart.items
          .filter(item => item.productId) // filter out null products
          .map((item) => (
          <Box key={item._id} borderWidth="1px" borderRadius="lg" p={4} shadow="md">
            <HStack spacing={4} justify="space-between">
              <HStack spacing={4}>
                <Image
                  src={item.productId?.image ? `http://localhost:5000${item.productId.image}` : '/default-image.png'}
                  alt={item.productId?.name || 'Product'}
                  width="250px"
                  height="150px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">{item.productId?.name || 'Unknown Product'}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>Price: Rs. {item.price}</Text>
                  <Text>Total: Rs. {item.total}</Text>
                </VStack>
              </HStack>
              <Button colorScheme="red" onClick={() => handleRemoveCart(item._id)}>Remove</Button>
            </HStack>
          </Box>
        ))}
      </VStack>
      <Divider my={6} />
      <HStack justify="space-between">
        <Heading size="lg">Subtotal: Rs. {cart.items.reduce((acc, item) => acc + (item.total || 0), 0)}</Heading>
        <Button colorScheme="green" onClick={handleBuy}>Buy Now</Button>
        <Button colorScheme="red" onClick={handleClearCart}>Clear Cart</Button>
      </HStack>
    </Box>
  );
};

export default Cart;

