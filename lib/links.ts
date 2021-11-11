export const Links = {
  adminGroups: "/dashboard/group",
  adminDocuments: "/dashboard/documents",
  adminNewDocuments: "/dashboard/documents/new",
  adminUpdateDocuments: (id: string) => `/dashboard/documents/${id}`,
} as const;
