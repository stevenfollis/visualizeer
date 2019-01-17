import Vue from "vue";

Vue.filter("nodeName", value => value.split("/")[1]);

Vue.filter("containerRepository", value => {
  // If container is a k8s pod, use the label namespace
  if (value["Labels"]["io.kubernetes.pod.namespace"]) {
    return value["Labels"]["io.kubernetes.pod.namespace"];
  }

  // For a full image name, parse out the repository
  // ex. docker/ucp-pause:3.0.0-beta3 becomes docker/ucp-pause
  // Catch images without a repository (ex. nginx)
  const regularExpression = new RegExp(/(?:.+\/)/g);
  const parsedValue = regularExpression.exec(value.Image);

  if (parsedValue === null) {
    return "";
  }

  return parsedValue[0];
});

Vue.filter("containerImage", value => {
  // If container is a k8s pod, use the label name
  if (value["Labels"]["io.kubernetes.pod.name"]) {
    return value["Labels"]["io.kubernetes.pod.name"];
  }

  // For a full image name, parse out just the image
  // ex. docker/ucp-pause:3.0.0-beta3 becomes ucp-pause
  // (?:.+\/)|.+?(?=:)
  const regularExpression = new RegExp(/(?:.+\/)/g);
  const parsedValue = regularExpression.exec(value.Image);

  if (parsedValue === null) {
    return "";
  }

  return value.Image.replace(parsedValue[0], "").split(":")[0];
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
  if (response !== null && response.length > 8) {
    return "";
  } else {
    return response;
  }
});

Vue.filter("capitalize", value => {
  if (!value) return "";
  const valueString = value.toString();
  return valueString.charAt(0).toUpperCase() + value.slice(1);
});