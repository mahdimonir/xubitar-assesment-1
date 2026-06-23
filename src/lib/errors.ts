export function formatDatabaseError(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("readonly") ||
      msg.includes("read-only") ||
      msg.includes("attempt to write a readonly database")
    ) {
      return "The database is currently in read-only mode. Database changes cannot be saved.";
    }
    if (msg.includes("unique constraint") || msg.includes("p2002")) {
      return "A preorder with this name already exists.";
    }
    if (msg.includes("locked") || msg.includes("database is locked")) {
      return "The database is temporarily busy. Please try again in a moment.";
    }
  }
  return defaultMessage;
}
