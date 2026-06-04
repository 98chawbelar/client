const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api";
  } else {
    return "https://mrbs-server.vercel.app/api";
  }
};

export default getBaseUrl;
