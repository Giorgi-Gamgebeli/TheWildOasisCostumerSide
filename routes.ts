// Array of routes which are accesable to public

export const publicRoutes = [
  "/",
  "/about",
  "/cabins",
  "/sitemap.xml",
  "/robots.txt",
];

// Array of routes which has all nested routes public example: /cabins/[cabinId]

export const fullPublicRoutes = ["/cabins"];

// Array of routes which are nesseary for authentication

export const authRoutes = ["/login"];

// Auth prefix

export const apiAuthPrefix = "/api/auth";

// Route thats user being redirected to

export const DEFAULT_LOGIN_REDIRECT = "/account";
