import { Box, Heading, Text } from "@chakra-ui/react";
export default function About() {
  return (
    <Box maxW="lg" mx="auto" p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={3}>
        Over deze app
      </Heading>
      <Text fontSize="sm" color="gray.700" mb={2}>
        Deze Event planner is project voor React Advanced.
      </Text>
      <Text fontSize="sm" color="gray.700">
        Je kunt events bekijken, zoeken, filteren, aanmaken, bewerken,
        verwijderen en je interesse doorgeven. De nieuwsbriefpagina is er om
        toekomstige updates te verzamelen.
      </Text>
    </Box>
  );
}
