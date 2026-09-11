import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path — keep live so old links resolve. */
export const Route = createFileRoute("/how-it-works")({
  beforeLoad: () => {
    throw redirect({ to: "/product" });
  },
});
