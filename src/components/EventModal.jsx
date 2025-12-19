import {
  Box,
  Button,
  Heading,
  Input,
  Textarea,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function EventModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title,
  submitLabel,
}) {
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });

  useEffect(() => {
    setFormData({
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      image: initialValues?.image || "",
      startTime: initialValues?.startTime || "",
      endTime: initialValues?.endTime || "",
      categoryIds: initialValues?.categoryIds || [],
    });
  }, [initialValues, isOpen]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await onSubmit(formData);
      toast({ status: "success", title: "Event saved" });
      onClose();
      // reset alleen bij “Add”
      if (!initialValues) {
        setFormData({
          title: "",
          description: "",
          image: "",
          startTime: "",
          endTime: "",
          categoryIds: [],
        });
      }
    } catch {
      toast({ status: "error", title: "Failed to save event" });
    }
  }

  // Sluit bij Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Overlay
    <Box
      position="fixed"
      inset="0"
      bg="blackAlpha.600"
      zIndex="modal"
      display="grid"
      placeItems="center"
      px={4}
    >
      {/* Content */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        _dark={{ bg: "gray.800" }}
        w="full"
        maxW="lg"
        rounded="md"
        shadow="xl"
        p={6}
      >
        <HStack justify="space-between" mb={4}>
          <Heading size="md">{title || "Event"}</Heading>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </HStack>

        <VStack align="stretch" spacing={4}>
          <Input
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            isRequired
          />
          <Textarea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            isRequired
          />
          <Input
            placeholder="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            isRequired
          />
          <HStack>
            <Input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              isRequired
            />
            <Input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              isRequired
            />
          </HStack>

          {/* TODO: categorie-selectie (multi) later toevoegen */}
        </VStack>

        <HStack justify="flex-end" mt={6}>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="teal" type="submit">
            {submitLabel || "Save"}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
