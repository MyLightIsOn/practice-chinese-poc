import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(request.url);

    // Get the text parameter from the search params
    const text = searchParams.get("text");

    // If no text parameter is provided, return a 400 Bad Request
    if (!text) {
      return NextResponse.json(
        { error: "Text parameter is required" },
        { status: 400 },
      );
    }

    // Get pagination parameters
    const page = searchParams.get("page");
    const pageSize = searchParams.get("page_size");

    // Get the backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL is not configured" },
        { status: 500 },
      );
    }

    // Construct the URL for the backend API
    let apiUrl = `${backendUrl}/lookup?text=${encodeURIComponent(text)}`;

    // Add pagination parameters if provided
    if (page) {
      apiUrl += `&page=${page}`;
    }

    if (pageSize) {
      apiUrl += `&page_size=${pageSize}`;
    }
    console.log("------------------------------");
    console.log(apiUrl);
    console.log("------------------------------");

    // Make the request to the backend API
    const response = await fetch(apiUrl);

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error(
        `Backend API returned ${response.status}: ${response.statusText}`,
      );
    }

    // Get the response data
    const data = await response.json();

    // Return the response data
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in lookup API route:", error);

    // Return a 500 Internal Server Error
    return NextResponse.json(
      { error: "Failed to fetch data from backend API" },
      { status: 500 },
    );
  }
}
