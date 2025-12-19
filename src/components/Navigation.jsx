import { HStack, Button, Spacer } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function Navigation({ onOpenAdd }) {
  return (
    <HStack py={4}>
      <Button as={RouterLink} to="/" variant="ghost">
        Events
      </Button>
      <Button as={RouterLink} to="/about" variant="ghost">
        About
      </Button>
      <Spacer />
      <Button colorScheme="teal" onClick={onOpenAdd}>
        Add Event
      </Button>
    </HStack>
  );
}
