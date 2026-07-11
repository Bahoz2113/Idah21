import type { Role } from "@cezeri/config";

// Oturumdaki kullanıcı — multi-tenant: her isteğe orgId taşınır
export interface SessionUser {
  id: string;
  organizationId: string;
  role: Role;
  email: string;
}
