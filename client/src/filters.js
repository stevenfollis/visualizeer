import Vue from "vue";

Vue.filter("nodeName", value => value.split("/")[1]);

Vue.filter("containerRepository", value => {
  // For a full image name, parse out the repository
  // ex. docker/ucp-pause:3.0.0-beta3 becomes docker/ucp-pause
  // Catch images without a repository (ex. nginx)
  const regularExpression = new RegExp(/(?:.+\/)/g);
  const parsedValue = regularExpression.exec(value);

  if (parsedValue === null) {
    return "";
  }

  return parsedValue[0];
});

Vue.filter("containerImage", value => {
  // For a full image name, parse out just the image
  // ex. docker/ucp-pause:3.0.0-beta3 becomes ucp-pause
  const regularExpression = new RegExp(/(?:.+\/)/g);
  const parsedValue = regularExpression.exec(value);

  if (parsedValue === null) {
    return "";
  }

  // Take a first pass at parsing the container image
  let rawContainerImage = value.split(parsedValue)[1].split(":")[0];

  // Strip out any SHA-ness
  if (rawContainerImage.indexOf("@sha256") !== -1) {
    rawContainerImage = rawContainerImage.replace("@sha256", "");
  }

  return rawContainerImage;
});

Vue.filter("containerTag", value => {
  // Remove SHA then return differently if colon is present
  let response;
  if (value.split("@")[0].indexOf(":") === -1) {
    response = null;
  } else {
    response = value
      .split("@")[0]
      .split(":")
      .pop(-1);
  }
  return response;
});

Vue.filter("capitalize", value => {
  if (!value) return "";
  const valueString = value.toString();
  return valueString.charAt(0).toUpperCase() + value.slice(1);
});
