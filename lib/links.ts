export const Links = {
  adminDocuments: "/dashboard/documents",
  adminNewDocuments: "/dashboard/documents/new",
  adminUpdateDocuments: (id: string) => `/dashboard/documents/${id}`,
} as const;
