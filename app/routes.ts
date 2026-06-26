import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("home", "routes/home.tsx"),
  route("pokemon/:id", "routes/pokemon.$id.tsx"),
  route("catch", "routes/catch.tsx"),
  route("my-pokemon", "routes/my-pokemon._index.tsx"),
  route("my-pokemon/:id", "routes/my-pokemon.$id.tsx"),
] satisfies RouteConfig;
