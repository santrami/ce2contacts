import { toast } from "react-toastify";

export const fetchSearchData = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    if (!text) {
      throw new Error('Empty response received');
    }

    try {
      const data = JSON.parse(text);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      return data;
    } catch (e) {
      console.error('Failed to parse JSON:', text);
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Failed to fetch data. Please try again.');
    throw error;
  }
};