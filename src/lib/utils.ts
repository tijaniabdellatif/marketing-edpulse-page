import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatOccupation(occupation: string): string {
  switch (occupation) {
    case "STUDENT":
      return "Student";
    case "EMPLOYEE":
      return "Employee";
    case "FREELANCER":
      return "Freelancer";
    case "FREE_OF_FUNCTION":
      return "Free of Function";
    default:
      return occupation;
  }
}




/**
 * Get visitor's IP address
 * Note: This will only work server-side
 */
export function getClientIp(request: Request): string | null {
  // Try X-Forwarded-For header first (common with proxies)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  // Try other common headers
  return (
    request.headers.get("cf-connecting-ip") || // Cloudflare
    request.headers.get("x-real-ip") || // NGINX
    request.headers.get("x-client-ip") || // Apache
    null
  );
}



export function saveVisitorId(visitorId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('visitorId', visitorId);
  }
}

/**
 * Get visitor ID from localStorage
 */
export function getVisitorId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('visitorId');
  }
  return null;
}

/**
 * Remove visitor ID from localStorage
 */
export function removeVisitorId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('visitorId');
  }
}