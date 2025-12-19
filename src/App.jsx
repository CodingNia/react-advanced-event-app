import {
  Container,
  Box,
  Flex,
  HStack,
  Heading,
  Button,
} from "@chakra-ui/react";
import { Routes, Route, Link as RouterLink } from "react-router-dom";
import EventsPage from "./pages/EventsPage.jsx";
import EventPage from "./pages/EventPage.jsx";
import About from "./pages/About.jsx";
import NewsletterPage from "./pages/NewsletterPage.jsx";

export default function App() {
  return (
    <Box bg="gray.50" minH="100vh">
      {/* navigatiebalk */}
      <Box bg="teal.600" color="white" boxShadow="sm">
        <Container maxW="container.lg">
          <Flex
            as="header"
            py={4}
            align="center"
            justify="space-between"
            gap={4}
          >
            <Heading size="md">
              <RouterLink to="/">Event Planner</RouterLink>
            </Heading>

            <HStack spacing={3}>
              <Button
                as={RouterLink}
                to="/"
                size="sm"
                variant="outline"
                colorScheme="teal"
                bg="white"
              >
                Events
              </Button>
              <Button
                as={RouterLink}
                to="/newsletter"
                size="sm"
                variant="ghost"
                color="white"
              >
                Nieuwsbrief
              </Button>
              <Button
                as={RouterLink}
                to="/about"
                size="sm"
                variant="ghost"
                color="white"
              >
                Over deze app
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* pagina inhoud */}
      <Container maxW="container.lg" py={6}>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Container>
    </Box>
  );
}
