//Service for local server
export const login = async (username: string, token: string) => {
  const url = "/login";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, token }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }

  //handle redirect
  if (response.redirected) {
    window.location.href = response.url;
  }
};
