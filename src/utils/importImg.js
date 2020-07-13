function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const img = importAll(
  require.context("../static/image", false, /\.(png|jpe?g|svg)$/)
);
const imgRewards = importAll(
  require.context("../static/image/rewards", false, /\.(png|jpe?g|svg)$/)
);
export { img, imgRewards };
