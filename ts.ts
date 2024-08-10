// Define the type for the items in the initial array
type Item = {
  num: number;
  str: string;
};

// Define the type for the items in the resulting secarr array
type SecArrItem = {
  id: number; // The unique identifier (same as num)
  count: number; // The number of occurrences of this num
  data: Item; // The data associated with this num
};

// Initial array with objects containing num and str properties
const arr: Item[] = [
  { num: 4, str: "4" },
  { num: 3, str: "3" },
  { num: 4, str: "4" },
  { num: 4, str: "4" },
  { num: 3, str: "3" },
  { num: 2, str: "2" },
  { num: 1, str: "1" },
  { num: 2, str: "2" },
  { num: 6, str: "6" },
  { num: 2, str: "2" },
  { num: 2, str: "2" },
  { num: 3, str: "3" },
];

// Function to group items by num and count their occurrences
function groupItems(arr: Item[]): SecArrItem[] {
  // Create a Map to hold the count and data for each unique num
  // The key is the num, and the value is an object with count and data
  const map = new Map<number, { count: number; data: Item }>();

  // Iterate through each item in the input array
  for (const item of arr) {
    const { num } = item; // Extract the num property from the current item

    // Check if the num already exists in the map
    if (map.has(num)) {
      // If it exists, increment the count for this num
      map.get(num)!.count++;
    } else {
      // If it doesn't exist, add a new entry with count 1 and the current item as data
      map.set(num, { count: 1, data: item });
    }
  }

  // Convert the Map into an array of objects as per the required secarr format
  // Array.from() iterates over the Map entries and creates the final array
  return Array.from(map, ([id, { count, data }]) => ({
    id, // Use the num as the id
    count, // The count of occurrences of this num
    data, // The associated data for this num
  }));
}

// Call the groupItems function with the initial array to get the secarr array
const secarr = groupItems(arr);

// Output the result to the console for verification
console.log(secarr);
