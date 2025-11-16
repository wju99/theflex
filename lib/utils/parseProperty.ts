/**
 * Extracts the actual property address from a listing name
 * Examples:
 * "2B N1 A - 29 Shoreditch Heights" -> "29 Shoreditch Heights"
 * "Airbnb - 2B N1 A - 29 Shoreditch Heights" -> "29 Shoreditch Heights"
 * "VRBO - 2B N1 A - 29 Shoreditch Heights" -> "29 Shoreditch Heights"
 * "3B N2 B - 45 Brick Lane" -> "45 Brick Lane"
 */
export function parsePropertyAddress(listingName: string): string {
  // Remove channel prefixes (Airbnb, Booking.com, VRBO, etc.)
  let cleaned = listingName
    .replace(/^(Airbnb|Booking\.com|VRBO|Expedia)\s*-\s*/i, "")
    .trim();

  // Pattern to match addresses like "45 Brick Lane" or "29 Shoreditch Heights"
  // Look for patterns like: number + street name
  // Common patterns:
  // - "XX Street Name" (e.g., "45 Brick Lane")
  // - "XX Area Name" (e.g., "29 Shoreditch Heights")
  
  // Try to extract the address part after the last " - " separator
  const parts = cleaned.split(" - ");
  if (parts.length > 1) {
    // Take the last part which is usually the address
    const lastPart = parts[parts.length - 1].trim();
    
    // Check if it looks like an address (starts with a number)
    if (/^\d+/.test(lastPart)) {
      return lastPart;
    }
  }

  // If no separator, try to find address pattern in the string
  // Look for pattern: number followed by words (street/area name)
  const addressMatch = cleaned.match(/\d+\s+[A-Za-z\s]+$/);
  if (addressMatch) {
    return addressMatch[0].trim();
  }

  // Fallback: return the cleaned name without channel prefix
  return cleaned;
}

/**
 * Gets a normalized property identifier for grouping
 */
export function getPropertyId(listingName: string): string {
  return parsePropertyAddress(listingName);
}

/**
 * Converts a property address to a URL-friendly ID
 * Example: "29 Shoreditch Heights" -> "29-shoreditch-heights"
 */
export function getPropertyUrlId(listingName: string): string {
  const address = parsePropertyAddress(listingName);
  return address
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Extracts the unit information from a listing name
 * Examples:
 * "2B N1 A - 29 Shoreditch Heights" -> "2B N1 A"
 * "Airbnb - 2B N1 A - 29 Shoreditch Heights" -> "2B N1 A"
 * "Booking.com - 3B N2 B - 45 Brick Lane" -> "3B N2 B"
 */
export function parseUnitInfo(listingName: string): string | null {
  // Remove channel prefixes
  let cleaned = listingName
    .replace(/^(Airbnb|Booking\.com|VRBO|Expedia)\s*-\s*/i, "")
    .trim();

  // Split by " - " to get parts
  const parts = cleaned.split(" - ");
  
  if (parts.length > 1) {
    // The first part before the address is usually the unit
    const unitPart = parts[0].trim();
    // Check if it looks like a unit (not an address - addresses usually start with numbers)
    // Units often have patterns like "2B N1 A" or "3B N2 B"
    if (unitPart && !/^\d+\s+[A-Za-z]/.test(unitPart)) {
      return unitPart;
    }
  }

  return null;
}

