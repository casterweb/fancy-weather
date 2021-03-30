const body = document.querySelector("#body");

const getLinkToImage = async () => {
  const url =
    "https://api.unsplash.com/photos/random?&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17";
  const response = await fetch(url);
  const data = await response.json();
  return data.urls.regular;
};

export async function getBackground() {
  try {
    const backgroundLink = await getLinkToImage();
    body.style.backgroundImage = `url(${backgroundLink})`;
    body.style.transition = "2s";
  } catch (error) {
    console.error(error);
  }
}
