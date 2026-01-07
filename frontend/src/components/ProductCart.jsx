import React, { useState } from 'react';
import { FaCartPlus } from "react-icons/fa";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    Box,
    Heading,
    HStack,
    VStack,
    IconButton,
    Image,
    Input,
    Button,
    Text,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useToast,
    useDisclosure
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cart';
import { useProductStore } from '../store/product';

const ProductCart = ({ product }) => {
    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const { deleteProducts, updateProducts } = useProductStore();
    const { addToCart } = useCartStore();
    const { user } = useAuthStore();

    const [quantity, setQuantity] = useState(1);
    const [updatedProduct, setUpdatedProduct] = useState({ ...product });
    const [newImageFile, setNewImageFile] = useState(null);

    // BUY NOW
    const handleBuy = () => navigate("/billing");

    // ADD TO CART
    const handleAddtoCart = async () => {
        if (quantity <= 0) {
            return toast({
                title: "Invalid Quantity",
                description: "Please select a valid quantity",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }

        const { success, message } = await addToCart(
            product._id,
            parseInt(quantity),
            product.price,
            product.image
        );

        toast({
            title: success ? "Product Added to Cart" : "Error",
            description: message,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true
        });
    };

    // DELETE PRODUCT
    const handleDeleteProduct = async (pid) => {
        const { success, message } = await deleteProducts(pid);

        toast({
            title: success ? "Deleted Successfully" : "Error deleting product",
            description: message,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true
        });
    };

    // UPDATE PRODUCT
    const handleUpdateProduct = async () => {
        try {
            const formData = new FormData();
            formData.append("name", updatedProduct.name);
            formData.append("unit", updatedProduct.unit);

            const priceNumber = Number(updatedProduct.price);
            if (!isNaN(priceNumber)) formData.append("price", priceNumber);

            if (newImageFile) {
                formData.append("image", newImageFile);
            }

            const res = await updateProducts(product._id, formData);
            const { success, message } = res;

            toast({
                title: success ? "Updated Successfully!" : "Update Failed",
                description: message,
                status: success ? "success" : "error",
                duration: 3000,
                isClosable: true
            });

            if (success) {
                // UI update
                product.name = updatedProduct.name;
                product.price = priceNumber;
                product.unit = updatedProduct.unit;

                if (newImageFile && res.product?.image) {
                    product.image = res.product.image;
                }

                setUpdatedProduct({ ...product });
                setNewImageFile(null);
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Quantity handlers
    const handleMinus = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
    const handlePlus = () => setQuantity(quantity + 1);

    return (
        <Box
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
            bg={bg}
        >
            {/* FIXED IMAGE UPDATE */}
            <Image
                src={
                    newImageFile
                        ? URL.createObjectURL(newImageFile)
                        : updatedProduct.image
                        ? `http://localhost:5000${updatedProduct.image}`
                        : `http://localhost:5000${product.image}`
                }
                alt={updatedProduct.name || product.name}
                h={48}
                w="full"
                objectFit="cover"
            />

            <Box p={4}>
                <Heading as="h3" size="md" mb={2}>
                    {updatedProduct.name || product.name}
                </Heading>

                <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
                    ₹ {(updatedProduct.price || product.price)}/
                    {updatedProduct.unit || product.unit}
                </Text>

                {/* Seller View */}
                {user.accountType === "seller" ? (
                    <HStack spacing={2}>
                        <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme="blue" />
                        <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)} colorScheme="red" />
                    </HStack>
                ) : (
                    <>
                        <Button onClick={handleBuy} mr={2}>Buy Now</Button>

                        <IconButton
                            icon={<FaCartPlus />}
                            onClick={handleAddtoCart}
                            colorScheme="red"
                        />

                        <HStack mt={2}>
                            <Button onClick={handleMinus}>-</Button>

                            <Input
                                value={quantity}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) setQuantity(value);
                                }}
                                onBlur={() => setQuantity(parseInt(quantity) || 1)}
                                w="70px"
                                textAlign="center"
                            />

                            <Button onClick={handlePlus}>+</Button>
                        </HStack>
                    </>
                )}
            </Box>

            {/* UPDATE PRODUCT MODAL */}
            <Modal
                isOpen={isOpen}
                onClose={() => { onClose(); setNewImageFile(null); }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Product</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <VStack spacing={3}>
                            <Input
                                placeholder="Product Name"
                                value={updatedProduct.name}
                                onChange={(e) =>
                                    setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                                }
                            />

                            <Input
                                placeholder="Product Price"
                                type="number"
                                value={updatedProduct.price}
                                onChange={(e) =>
                                    setUpdatedProduct({ ...updatedProduct, price: e.target.value })
                                }
                            />

                            <Input
                                placeholder="Unit"
                                value={updatedProduct.unit}
                                onChange={(e) =>
                                    setUpdatedProduct({ ...updatedProduct, unit: e.target.value })
                                }
                            />

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewImageFile(e.target.files[0])}
                            />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
                            Update
                        </Button>
                        <Button variant="ghost" onClick={() => { onClose(); setNewImageFile(null); }}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ProductCart;
