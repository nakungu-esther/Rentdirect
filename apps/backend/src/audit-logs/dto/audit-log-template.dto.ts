export class AuditLogTemplateDto {
  action: string;
  actorId: string;
  metadata?: Record<string, unknown>;
}
